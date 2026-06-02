'use client'

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts'
import styles from './EnergyDashboard.module.css'

const STEP_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa']

export default function EnergyDashboard({ data }) {
    const steps = data.steps ?? []
    const totalEnergy = steps.reduce(
        (sum, s) => sum + parseFloat(s.energy_joules || 0),
        0,
    )
    const totalTime = steps.reduce((sum, s) => sum + parseFloat(s.time || 0), 0)

    const chartData = steps.map((s) => ({
        label: s.label,
        energy: parseFloat(parseFloat(s.energy_joules).toFixed(3)),
        time: parseFloat(parseFloat(s.time).toFixed(1)),
    }))

    return (
        <div className={styles.wrapper}>
            <div className={styles.meta}>
                <p className={styles.ts}>
                    {new Date(data.timestamp).toLocaleString('sv-SE')}
                </p>
                <a
                    className={styles.link}
                    href={data.workflow_url}
                    target="_blank"
                    rel="noopener"
                >
                    Run #{data.run_id} ↗
                </a>
            </div>

            <div className={styles.totals}>
                <div className={styles.stat}>
                    <span className={styles.statVal}>
                        {totalEnergy.toFixed(2)}
                    </span>
                    <span className={styles.statLabel}>total joules</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statVal}>
                        {totalTime.toFixed(1)}
                    </span>
                    <span className={styles.statLabel}>total seconds</span>
                </div>
            </div>

            <div className={styles.chart}>
                <p className={styles.chartTitle}>Energy per phase (J)</p>
                <ResponsiveContainer width="100%" height={160}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                    >
                        <XAxis
                            dataKey="label"
                            tick={{ fontSize: 11, fill: '#9ca3af' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                fontSize: 12,
                                borderRadius: 8,
                                border: '1px solid #e5e7eb',
                            }}
                            formatter={(v) => [`${v} J`, 'Energy']}
                        />
                        <Bar dataKey="energy" radius={[4, 4, 0, 0]}>
                            {chartData.map((_, i) => (
                                <Cell
                                    key={i}
                                    fill={STEP_COLORS[i % STEP_COLORS.length]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.table}>
                <div className={styles.row + ' ' + styles.rowHead}>
                    <span>Phase</span>
                    <span>Joules</span>
                    <span>Seconds</span>
                    <span>Avg CPU</span>
                </div>
                {steps.map((s, i) => (
                    <div key={i} className={styles.row}>
                        <span>{s.label}</span>
                        <span>{parseFloat(s.energy_joules).toFixed(3)}</span>
                        <span>{parseFloat(s.time).toFixed(1)}</span>
                        <span>{parseFloat(s.cpu_avg_percent).toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
