'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import styles from './HourlyChart.module.css'

export default function HourlyChart({ data, color = '#6366f1', label, unit, who }) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>{label} <span className={styles.unit}>({unit})</span></p>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <XAxis
            dataKey="hour"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            interval={3}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            formatter={(v) => [`${v?.toFixed(1)} ${unit}`, label]}
            labelFormatter={(l) => `${l}:00`}
          />
          {who && (
            <ReferenceLine y={who} stroke="#f87171" strokeDasharray="4 2" />
          )}
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
