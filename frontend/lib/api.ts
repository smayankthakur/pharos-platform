import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// API Response type
export interface APIResponse<T = any> {
  success: boolean;
  data: T | null;
  error: string | null;
  timestamp: string;
}

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Check if response has standardized format
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      if (!response.data.success) {
        // API returned an error in standardized format
        const error = new Error(response.data.error || 'An error occurred');
        (error as any).response = response;
        return Promise.reject(error);
      }
      // Return the data portion for successful responses
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle different error scenarios
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;
      
      // Handle standardized error responses
      if (data && typeof data === 'object' && 'error' in data) {
        error.message = data.error || 'An error occurred';
      }
      
      // Handle authentication errors
      if (status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        error.message = 'Session expired. Please login again.';
      }
      
      // Handle forbidden errors
      if (status === 403) {
        error.message = 'You do not have permission to perform this action.';
      }
      
      // Handle not found errors
      if (status === 404) {
        error.message = 'The requested resource was not found.';
      }
      
      // Handle server errors
      if (status >= 500) {
        error.message = 'Server error. Please try again later.';
      }
    } else if (error.request) {
      // Network error
      error.message = 'Network error. Please check your connection.';
    }
    
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post<APIResponse<{ access_token: string; token_type: string; user: any }>>('/auth/login', { email, password }),
  
  register: (data: { email: string; password: string; name: string; company?: string }) =>
    api.post<APIResponse<{ message: string; user_id: number }>>('/auth/register', data),
  
  getMe: () =>
    api.get<APIResponse<{ id: number; email: string; name: string; company: string | null; is_active: boolean }>>('/auth/me'),
};

// Dashboard API
export const dashboardAPI = {
  getDashboard: () => api.get<APIResponse<any>>('/dashboard'),
  getAlerts: () => api.get<APIResponse<any[]>>('/alerts'),
};

// AI API
export const aiAPI = {
  analyze: (data: {
    alerts?: any[];
    inventory?: any[];
    complianceScore?: number;
    analysis_type?: string;
  }) => api.post<APIResponse<{
    id: number;
    content: string;
    recommendations: string[];
    timestamp: string;
    analysis_type: string;
  }>>('/ai/analyze', data),
  
  getInsights: (limit?: number) =>
    api.get<APIResponse<Array<{
      id: number;
      content: string;
      recommendations: string[];
      timestamp: string;
      analysis_type: string;
    }>>>(`/ai/insights${limit ? `?limit=${limit}` : ''}`),
  
  runAutomation: () =>
    api.post<APIResponse<any>>('/ai/automation/check'),
};

export default api;
