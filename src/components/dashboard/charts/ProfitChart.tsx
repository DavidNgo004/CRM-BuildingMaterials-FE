import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ProfitChartPoint } from '../../../types/Admin/dashboard';
import styles from './ProfitChart.module.css';

// ─── ProfitChart ──────────────────────────────────────────────────────────────
// Bar chart hiển thị lợi nhuận gộp theo ngày/tháng.
// Dữ liệu từ DashboardChartService.profitChart()

interface ProfitChartProps {
  data: ProfitChartPoint[];
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

function getLabel(point: ProfitChartPoint): string {
  return point.date ?? point.month ?? '';
}

export default function ProfitChart({ data, isLoading }: ProfitChartProps) {
  if (isLoading || !data) {
    return (
      <div className={styles.card}>
        <div className={styles.title}> Xu hướng lợi nhuận</div>
        <div className={styles.skeletonChart} />
      </div>
    );
  }

  const chartData = data.map((p) => ({ ...p, label: getLabel(p) }));

  return (
    <div className={styles.card}>
      <div className={styles.title}>Xu hướng lợi nhuận</div>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
              formatter={(value, name) => {
                const labels: Record<string, string> = {
                  gross_profit: 'Lợi nhuận gộp',
                  revenue: 'Doanh thu',
                  cogs: 'Giá vốn',
                };

                return [fmtFull(Number(value ?? 0)), labels[String(name)] ?? String(name)];
              }}
              contentStyle={{
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Bar dataKey="gross_profit" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
