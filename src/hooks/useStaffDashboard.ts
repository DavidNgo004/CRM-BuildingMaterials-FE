import { useState, useEffect, useCallback } from "react";
import axiosClient from "../api/axiosClient";
import type { StaffKpi, StockChartPoint, LowStockProduct } from "../types/staff/staffDashboard";

interface StaffDashboardState {
  kpi: StaffKpi | null;
  stockChart: StockChartPoint[];
  lowStockProducts: LowStockProduct[];
  isLoading: boolean;
  error: string | null;
}

// ── Mock data khi backend chưa có staff endpoints ──────────────────────────────
function getMockKpi(): StaffKpi {
  return {
    san_pham_nhap_hom_nay: 120,
    dat_hang_hom_nay: 8,
    nhap_them_hom_nay: 5,
    nhap_tu_ngay_nay: 3,
  };
}

function getMockStockChart(): StockChartPoint[] {
  const points: StockChartPoint[] = [];
  const today = new Date();
  for (let i = 9; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    points.push({
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      quantity: Math.floor(Math.random() * 20) + 10,
    });
  }
  return points;
}

function getMockLowStock(): LowStockProduct[] {
  return [
    { id: 1, name: "Sắt Hộp Mạ Kẽm", unit: "Cây", current_stock: 5, reorder_level: 20, status: "critical" },
    { id: 2, name: "Xi Măng Bút Sơn", unit: "Bao", current_stock: 12, reorder_level: 30, status: "low" },
    { id: 3, name: "Gạch Ống 4 Lỗ", unit: "Viên", current_stock: 200, reorder_level: 500, status: "low" },
    { id: 4, name: "Cát Vàng Sông", unit: "M³", current_stock: 2, reorder_level: 10, status: "critical" },
    { id: 5, name: "Tôn Sóng Vuông", unit: "Tấm", current_stock: 8, reorder_level: 15, status: "low" },
  ];
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
      // Thử gọi API thực; nếu chưa có endpoint → dùng mock
      const [kpiRes, chartRes, alertRes] = await Promise.allSettled([
        axiosClient.get<StaffKpi>("/staff/dashboard/kpi"),
        axiosClient.get<StockChartPoint[]>("/staff/dashboard/stock-chart"),
        axiosClient.get<LowStockProduct[]>("/staff/dashboard/low-stock"),
      ]);

      const kpi = kpiRes.status === "fulfilled" ? kpiRes.value.data : getMockKpi();
      const stockChart = chartRes.status === "fulfilled" ? chartRes.value.data : getMockStockChart();
      const lowStockProducts = alertRes.status === "fulfilled" ? alertRes.value.data : getMockLowStock();

      setState({ kpi, stockChart, lowStockProducts, isLoading: false, error: null });
    } catch {
      // Dùng mock nếu lỗi hoàn toàn
      setState({
        kpi: getMockKpi(),
        stockChart: getMockStockChart(),
        lowStockProducts: getMockLowStock(),
        isLoading: false,
        error: null,
      });
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { ...state, refresh: fetchAll };
}
