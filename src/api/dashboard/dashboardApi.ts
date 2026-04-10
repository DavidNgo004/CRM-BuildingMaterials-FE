import axiosClient from '../axiosClient';
import type {
  DashboardKpi,
  DashboardCharts,
  Activity,
  DashboardAlerts,
  DashboardMiniReports,
  DashboardPeriod,
} from '../../types/Admin/dashboard';

// ─── Dashboard API Layer ──────────────────────────────────────────────────────
// Mỗi hàm map 1-1 với 1 endpoint của DashboardController backend.
// Tất cả dùng axiosClient đã có Bearer token interceptor.

const BASE = '/dashboard';

interface PeriodParams {
  period?: DashboardPeriod;
  start_date?: string;
  end_date?: string;
}

/** KPI Cards: Doanh thu, COGS, Expenses, Profit, Low Stock count */
export async function fetchKpiCards(params: PeriodParams = {}): Promise<DashboardKpi> {
  const { data } = await axiosClient.get<DashboardKpi>(`${BASE}/kpi-cards`, { params });
  return data;
}

/** Charts: Revenue, Profit, Top Products, Revenue by Product, Inventory Breakdown */
export async function fetchCharts(params: PeriodParams = {}): Promise<DashboardCharts> {
  const { data } = await axiosClient.get<DashboardCharts>(`${BASE}/charts`, { params });
  return data;
}

/** Recent Activities: inventory_logs với thông tin user + product */
export async function fetchActivities(limit = 15): Promise<Activity[]> {
  const { data } = await axiosClient.get<Activity[]>(`${BASE}/recent-activities`, {
    params: { limit },
  });
  return data;
}

/** Alerts & AI Suggestions: cảnh báo tồn kho + gợi ý nhập hàng */
export async function fetchAlerts(): Promise<DashboardAlerts> {
  const { data } = await axiosClient.get<DashboardAlerts>(`${BASE}/alerts`);
  return data;
}

/** Mini Reports: Top Customers + Top Suppliers */
export async function fetchMiniReports(params: PeriodParams = {}): Promise<DashboardMiniReports> {
  const { data } = await axiosClient.get<DashboardMiniReports>(`${BASE}/mini-reports`, { params });
  return data;
}
