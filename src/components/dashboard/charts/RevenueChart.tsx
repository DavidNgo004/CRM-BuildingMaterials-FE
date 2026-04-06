import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { RevenueChartPoint } from '../../../types/dashboard';
import styles from './RevenueChart.module.css';

// ─── RevenueChart ─────────────────────────────────────────────────────────────
// Line/Area chart hiển thị doanh thu theo ngày hoặc tháng.
// Dữ liệu từ DashboardChartService.revenueChart()

interface RevenueChartProps {
  data: RevenueChartPoint[];
  isLoading?: boolean;
}

const fmt = (v: number) =>
  new Intl.NumberFormat('vi-VN', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(v);

const fmtFull = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(v);

function getLabel(point: RevenueChartPoint): string {
  return point.date ?? point.month ?? '';
}

export default function RevenueChart({ data, isLoading }: RevenueChartProps) {
  if (isLoading || !data) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.title}>📊 Tổng quan doanh thu</span>
        </div>
        <div className={styles.skeletonChart} />
      </div>
    );
  }

  const chartData = data.map((p) => ({ ...p, label: getLabel(p) }));

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>📊 Tổng quan doanh thu</span>
      </div>

      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={fmt}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              width={55}
            />
            <Tooltip
              formatter={(value) => [fmtFull(Number(value ?? 0)), 'Doanh thu']}
              contentStyle={{
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={2.5}
              fill="url(#revenueGrad)"
              dot={{ r: 3, fill: '#2563eb', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#2563eb' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
