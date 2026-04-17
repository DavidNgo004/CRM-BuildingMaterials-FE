// ─── Staff Dashboard Types ────────────────────────────────────────────────────

export interface StaffKpi {
  san_pham_nhap_hom_nay: number;   // Sản phẩm nhập hôm nay
  dat_hang_hom_nay: number;        // Đặt hàng hôm nay
  nhap_them_hom_nay: number;       // Nhập thêm hôm nay
  nhap_tu_ngay_nay: number;        // Nhập từ ngày này
}

export interface StockChartPoint {
  date: string;
  quantity: number;
}

export interface LowStockProduct {
  id: number;
  name: string;
  unit: string;
  current_stock: number;
  reorder_level: number;
  status: 'critical' | 'low' | 'normal';
}

export interface StaffDashboardData {
  kpi: StaffKpi;
  stockChart: StockChartPoint[];
  lowStockProducts: LowStockProduct[];
}
