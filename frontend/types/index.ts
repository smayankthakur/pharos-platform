export interface KPI {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'warn' | 'cyan';
}

export interface Alert {
  id: number;
  title: string;
  detail: string;
  severity: 'critical' | 'warning' | 'info' | 'ok';
  timestamp: string;
  icon: string;
}

export interface AIInsight {
  id: number;
  content: string;
  recommendations: string[];
  timestamp: string;
}

export interface BatchHealth {
  id: string;
  name: string;
  percentage: number;
  status: 'ok' | 'warn' | 'crit';
}

export interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  batch: string;
  stock: number;
  expiry: string;
  status: string;
  trend: number[];
}

export interface DashboardData {
  kpis: KPI[];
  batchHealth: {
    overall: number;
    batches: BatchHealth[];
  };
  alerts: Alert[];
  inventory: InventoryItem[];
  complianceScore: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  company: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
