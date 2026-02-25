import type { ReactNode } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface InsightChartProps {
  title: string;
  subtitle: string;
  data: Array<Record<string, number | string>>;
  dataKey: string;
  stroke?: string;
  icon?: ReactNode;
  suffix?: string;
}

export function InsightChart({ title, subtitle, data, dataKey, stroke = '#0ea5e9', icon, suffix }: InsightChartProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        {icon}
      </div>
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={25} />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 6px 25px rgba(15, 23, 42, 0.12)',
                fontSize: 12,
              }}
              formatter={(value: number) => [`${value}${suffix ?? ''}`, title] as [string, string]}
            />
            <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
