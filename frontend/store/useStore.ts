import { create } from 'zustand';
import { dashboardAPI, aiAPI } from '@/lib/api';
import { DashboardData, Alert, AIInsight } from '@/types';

interface StoreState {
  // Data
  kpis: DashboardData['kpis'];
  batchHealth: DashboardData['batchHealth'];
  alerts: Alert[];
  inventory: DashboardData['inventory'];
  complianceScore: number;
  insight: AIInsight | null;
  
  // Loading states
  isLoading: boolean;
  isAILoading: boolean;
  
  // Error
  error: string | null;
  
  // Actions
  fetchDashboard: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  fetchAI: (data: any) => Promise<void>;
  clearError: () => void;
}

const useStore = create<StoreState>((set, get) => ({
  // Initial data
  kpis: [],
  batchHealth: { overall: 0, batches: [] },
  alerts: [],
  inventory: [],
  complianceScore: 0,
  insight: null,
  
  // Loading states
  isLoading: false,
  isAILoading: false,
  
  // Error
  error: null,
  
  // Actions
  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await dashboardAPI.getDashboard();
      const data = response.data;
      set({
        kpis: data.kpis,
        batchHealth: data.batchHealth,
        alerts: data.alerts,
        inventory: data.inventory,
        complianceScore: data.complianceScore,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch dashboard data',
        isLoading: false,
      });
    }
  },
  
  fetchAlerts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await dashboardAPI.getAlerts();
      set({
        alerts: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch alerts',
        isLoading: false,
      });
    }
  },
  
  fetchAI: async (data: any) => {
    set({ isAILoading: true, error: null });
    try {
      const response = await aiAPI.analyze(data);
      set({
        insight: response.data,
        isAILoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch AI insights',
        isAILoading: false,
      });
    }
  },
  
  clearError: () => set({ error: null }),
}));

export default useStore;
