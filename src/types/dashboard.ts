// ─── Dashboard Types ──────────────────────────────────────────────────────────
// Map 1-1 với JSON response từ 5 endpoints của DashboardController backend.

// ── Period filter ─────────────────────────────────────────────────────────────

export type DashboardPeriod = 'today' | 'this_week' | 'this_month' | 'this_year';

// ── KPI Cards (GET /api/dashboard/kpi-cards) ──────────────────────────────────

export interface DashboardKpi {
  revenue: number;           // Doanh thu kỳ
  revenue_today: number;     // Doanh thu hôm nay
  cogs: number;              // Giá vốn hàng bán
  expenses: number;          // Chi phí vận hành
  profit: number;            // Lợi nhuận ròng
  export_count: number;      // Số đơn xuất trong kỳ
  export_count_today: number;
  import_count: number;      // Số đơn nhập trong kỳ
  import_count_today: number;
  low_stock_count: number;   // Số sản phẩm sắp hết hàng
}

// ── Charts (GET /api/dashboard/charts) ────────────────────────────────────────

export interface RevenueChartPoint {
  date?: string;
  month?: string;
  revenue: number;
}

export interface ProfitChartPoint {
  date?: string;
  month?: string;
  revenue: number;
  cogs: number;
  gross_profit: number;
}

export interface TopProduct {
  product_id: number;
  name: string;
  unit: string;
  total_qty: number;
  total_revenue: number;
  percentage?: number; // revenueByProduct
}

export interface InventoryBreakdown {
  out_of_stock: number;
  low_stock: number;
  normal: number;
  overstock: number;
}

export interface DashboardCharts {
  revenue_chart: RevenueChartPoint[];
  profit_chart: ProfitChartPoint[];
  top_products: TopProduct[];
  revenue_by_product: TopProduct[];
  inventory_breakdown: InventoryBreakdown;
}

// ── Recent Activities (GET /api/dashboard/recent-activities) ──────────────────

export interface Activity {
  id: number;
  type: 'import' | 'export';
  description: string;
  product: string;
  unit: string;
  quantity: number;
  user: string;
  time: string;        // "5 phút trước"
  created_at: string;
}

// ── Alerts (GET /api/dashboard/alerts) ────────────────────────────────────────

export type AlertLevel = 'critical' | 'warning' | 'info';
export type AlertType = 'out_of_stock' | 'low_stock' | 'slow_moving' | 'overstock' | 'ai_forecast';

export interface InventoryAlert {
  type: AlertType;
  level: AlertLevel;
  message: string;
  product: string;
  drop_pct?: number;
  prior_qty?: number;
  last_qty?: number;
}

export interface AiSuggestion {
  product_id: number;
  product_name: string;
  unit: string;
  current_stock: number;
  reorder_level: number;
  suggested_qty: number;
  message: string;
}

export interface DashboardAlerts {
  alerts: InventoryAlert[];
  suggestions: AiSuggestion[];
}

// ── Mini Reports (GET /api/dashboard/mini-reports) ────────────────────────────

export interface TopCustomer {
  customer_id: number;
  name: string;
  code: string;
  phone: string;
  total_purchase: number;
  order_count: number;
}

export interface TopSupplier {
  supplier_id: number;
  name: string;
  code: string;
  phone: string;
  total_value: number;
  order_count: number;
}

export interface DashboardMiniReports {
  top_customers: TopCustomer[];
  top_suppliers: TopSupplier[];
}
