'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import s from './EnergyDashboard.module.scss'

const STEP_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa']

export default function EnergyDashboard({ data }) {
    const steps = (data.steps ?? []).filter(Boolean)
    const totalEnergy = steps.reduce((sum, step) => sum + parseFloat(step.energy_joules || 0), 0)
    const totalTime = steps.reduce((sum, step) => sum + parseFloat(step.time || 0), 0)

    const prev = data.previous_total_joules
    const deltaPct = prev && prev > 0 ? ((totalEnergy - prev) / prev) * 100 : null

    const chartData = steps.map((step) => ({
        label: step.label,
        energy: parseFloat(parseFloat(step.energy_joules).toFixed(3)),
        time: parseFloat(parseFloat(step.time).toFixed(1)),
    }))

    return (
        <div className={s.EnergyDashboard}>
            <div className={s['EnergyDashboard__Meta']}>
                <p>{new Date(data.timestamp).toLocaleString('sv-SE')}</p>
                <a className={s['EnergyDashboard__Link']} href={data.workflow_url} target="_blank" rel="noopener">
                    Run #{data.run_id} ↗
                </a>
            </div>

            <div className={s['EnergyDashboard__Totals']}>
                <div className={s['EnergyDashboard__Stat']}>
                    <span className={s['EnergyDashboard__StatValue']}>
                        {totalEnergy.toFixed(2)}
                        {deltaPct !== null && (
                            <span className={`${s['EnergyDashboard__Delta']} ${deltaPct > 0 ? s['EnergyDashboard__Delta--Up'] : s['EnergyDashboard__Delta--Down']}`}>
                                {deltaPct > 0 ? '▲' : '▼'} {Math.abs(deltaPct).toFixed(1)}%
                            </span>
                        )}
                    </span>
                    <span className={s['EnergyDashboard__StatLabel']}>total joules</span>
                </div>
                <div className={s['EnergyDashboard__Stat']}>
                    <span className={s['EnergyDashboard__StatValue']}>{totalTime.toFixed(1)}</span>
                    <span className={s['EnergyDashboard__StatLabel']}>total seconds</span>
                </div>
            </div>

            <div className={s['EnergyDashboard__Chart']}>
                <p className={s['EnergyDashboard__ChartTitle']}>Energy per phase (J)</p>
                <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
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
                            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                            formatter={(v) => [`${v} J`, 'Energy']}
                        />
                        <Bar dataKey="energy" radius={[4, 4, 0, 0]}>
                            {chartData.map((_, i) => (
                                <Cell key={i} fill={STEP_COLORS[i % STEP_COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className={s['EnergyDashboard__Table']}>
                <div className={`${s['EnergyDashboard__Row']} ${s['EnergyDashboard__Row--Head']}`}>
                    <span>Phase</span>
                    <span>Joules</span>
                    <span>Seconds</span>
                    <span>Avg CPU</span>
                </div>
                {steps.map((step, i) => (
                    <div key={i} className={s['EnergyDashboard__Row']}>
                        <span>{step.label}</span>
                        <span>{parseFloat(step.energy_joules).toFixed(3)}</span>
                        <span>{parseFloat(step.time).toFixed(1)}</span>
                        <span>{parseFloat(step.cpu_avg_percent).toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
