import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { RevenueChartPoint } from '../../../types/Admin/dashboard';
import styles from './RevenueChart.module.css';

// ─── RevenueChart (Overview) ──────────────────────────────────────────────────
// Line chart hiển thị doanh thu, lợi nhuận ròng và chi phí.

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
          <span className={styles.title}>Tổng quan doanh thu</span>
        </div>
        <div className={styles.skeletonChart} />
      </div>
    );
  }

  const chartData = data.map((p) => ({ ...p, label: getLabel(p) }));

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Tổng quan doanh thu</span>
      </div>

      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
              formatter={(value: any, name: any) => {
                let labelName = String(name);
                if (name === 'revenue') labelName = 'Doanh thu';
                if (name === 'net_profit') labelName = 'Lợi nhuận ròng';
                if (name === 'expense') labelName = 'Chi phí';
                return [fmtFull(Number(value) ?? 0), labelName];
              }}
              contentStyle={{
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                backgroundColor: '#fff',
              }}
            />
            <Legend 
               wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
               formatter={(value) => {
                if (value === 'revenue') return 'Doanh thu';
                if (value === 'net_profit') return 'Lợi nhuận ròng';
                if (value === 'expense') return 'Chi phí';
                return value;
               }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              name="revenue"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#2563eb', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="net_profit"
              name="net_profit"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              name="expense"
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
