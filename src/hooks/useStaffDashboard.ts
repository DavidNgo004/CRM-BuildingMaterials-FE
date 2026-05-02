import { useState, useEffect, useCallback } from "react";
import axiosClient from "../api/axiosClient";
import type { StaffKpi, StockChartPoint, LowStockProduct } from "../types/staff/staffDashboard";

interface StaffDashboardState {
  kpi: StaffKpi | null;
  stockChart: any[];
  lowStockProducts: LowStockProduct[];
  isLoading: boolean;
  error: string | null;
}

export function useStaffDashboard() {
  const [state, setState] = useState<StaffDashboardState>({
    kpi: null,
    stockChart: [],
    lowStockProducts: [],
    isLoading: true,
    error: null,
  });

  const fetchAll = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await axiosClient.get("/dashboard/summary");
      const data = res.data;

      // Extract KPI
      const kpiData = data.kpi_cards || {};
      const breakdown = data.charts?.inventory_breakdown || {};
      const totalProducts = (breakdown.out_of_stock || 0) + (breakdown.low_stock || 0) + (breakdown.normal || 0) + (breakdown.overstock || 0);

      const kpi: StaffKpi = {
        san_pham_nhap_hom_nay: totalProducts,
        dat_hang_hom_nay: kpiData.created_import_count_today || 0,
        nhap_them_hom_nay: kpiData.low_stock_count || 0,
        nhap_tu_ngay_nay: kpiData.created_export_count_today || 0,
      };

      // Extract Chart
      const stockChart = data.charts?.import_export_chart || [];

      // Extract Alerts (Low Stock Products)
      const alertsData = data.low_stock_products || [];
      const lowStockProducts: LowStockProduct[] = alertsData.map((item: any) => ({
        id: item.id,
        name: item.name,
        unit: item.unit,
        current_stock: item.current_stock,
        reorder_level: item.reorder_level,
        status: item.current_stock === 0 ? "critical" : "low",
      }));

      setState({ kpi, stockChart, lowStockProducts, isLoading: false, error: null });
    } catch (err: any) {
      setState(prev => ({ ...prev, isLoading: false, error: err.message || "Failed to load dashboard data" }));
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { ...state, refresh: fetchAll };
}
