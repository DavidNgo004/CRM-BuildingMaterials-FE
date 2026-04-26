import { useState, useEffect, useCallback } from 'react';
import type {
  DashboardKpi,
  DashboardCharts,
  Activity,
  DashboardAlerts,
  DashboardMiniReports,
  DashboardPeriod,
} from '../types/Admin/dashboard';
import { fetchSummary } from '../api/dashboard/dashboardApi';

// ─── useDashboard ─────────────────────────────────────────────────────────────
// Custom hook tổng hợp — gọi api summary lấy tất cả dữ liệu dashboard 1 lần.

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

    fetchSummary({ period })
      .then((data) => {
        if (cancelled) return;
        setKpi(data.kpi);
        setCharts(data.charts);
        setActivities(data.activities);
        setAlerts(data.alerts);
        setMiniReports(data.miniReports);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Không thể tải dữ liệu Dashboard. Vui lòng thử lại.');
        setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [period, tick]);

  return { kpi, charts, activities, alerts, miniReports, isLoading, error, refresh };
}
