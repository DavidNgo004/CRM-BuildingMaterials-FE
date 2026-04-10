import { useState, useEffect, useCallback } from 'react';
import type {
  DashboardKpi,
  DashboardCharts,
  Activity,
  DashboardAlerts,
  DashboardMiniReports,
  DashboardPeriod,
} from '../types/Admin/dashboard';
import {
  fetchKpiCards,
  fetchCharts,
  fetchActivities,
  fetchAlerts,
  fetchMiniReports,
} from '../api/dashboard/dashboardApi';

// ─── useDashboard ─────────────────────────────────────────────────────────────
// Custom hook tổng hợp — gọi parallel tất cả 5 dashboard endpoints.
//
// Cách dùng:
//   const { kpi, charts, activities, alerts, miniReports, isLoading, refresh } = useDashboard(period);
//
// Khi period thay đổi, hook tự động fetch lại dữ liệu.

interface UseDashboardReturn {
  kpi: DashboardKpi | null;
  charts: DashboardCharts | null;
  activities: Activity[];
  alerts: DashboardAlerts | null;
  miniReports: DashboardMiniReports | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useDashboard(period: DashboardPeriod = 'this_month'): UseDashboardReturn {
  const [kpi, setKpi] = useState<DashboardKpi | null>(null);
  const [charts, setCharts] = useState<DashboardCharts | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [alerts, setAlerts] = useState<DashboardAlerts | null>(null);
  const [miniReports, setMiniReports] = useState<DashboardMiniReports | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0); // trigger re-fetch

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const params = { period };

    // Fetch tất cả 5 endpoints song song để tối ưu tốc độ
    Promise.allSettled([
      fetchKpiCards(params),
      fetchCharts(params),
      fetchActivities(15),
      fetchAlerts(),
      fetchMiniReports(params),
    ]).then(([kpiRes, chartsRes, activitiesRes, alertsRes, miniRes]) => {
      if (cancelled) return;

      if (kpiRes.status === 'fulfilled') setKpi(kpiRes.value);
      if (chartsRes.status === 'fulfilled') setCharts(chartsRes.value);
      if (activitiesRes.status === 'fulfilled') setActivities(activitiesRes.value);
      if (alertsRes.status === 'fulfilled') setAlerts(alertsRes.value);
      if (miniRes.status === 'fulfilled') setMiniReports(miniRes.value);

      // Báo lỗi nếu ít nhất 1 request thất bại
      const failures = [kpiRes, chartsRes, activitiesRes, alertsRes, miniRes].filter(
        (r) => r.status === 'rejected',
      );
      if (failures.length > 0) {
        setError('Một số dữ liệu không tải được. Vui lòng thử lại.');
      }

      setIsLoading(false);
    });

    return () => { cancelled = true; };
  }, [period, tick]);

  return { kpi, charts, activities, alerts, miniReports, isLoading, error, refresh };
}
