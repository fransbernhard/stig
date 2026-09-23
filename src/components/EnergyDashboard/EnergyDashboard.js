import { niceScale } from '@/lib/chart'
import s from './EnergyDashboard.module.scss'

const STEP_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa']

const CHART = { width: 320, height: 160, top: 8, right: 8, bottom: 20, left: 34, maxBar: 80, radius: 4 }

// Plain SVG, rendered at build time — this component ships no JS
function EnergyChart({ data }) {
    const { width, height, top, right, bottom, left, maxBar, radius } = CHART
    const plotW = width - left - right
    const plotH = height - top - bottom
    const { max, ticks } = niceScale(Math.max(0, ...data.map((d) => d.energy)))

    const slot = plotW / Math.max(data.length, 1)
    const barW = Math.min(maxBar, slot * 0.8)
    const y = (v) => top + plotH - (v / max) * plotH

    return (
        <svg className={s['EnergyDashboard__Svg']} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Energi per fas i joule">
            {ticks.map((t) => (
                <text key={t} x={left - 6} y={y(t)} className={s['EnergyDashboard__Tick']} textAnchor="end" dominantBaseline="middle">
                    {t}
                </text>
            ))}
            {data.map((d, i) => {
                const cx = left + slot * i + slot / 2
                const x0 = cx - barW / 2
                const y0 = y(d.energy)
                const r = Math.min(radius, barW / 2, top + plotH - y0)
                const base = top + plotH
                return (
                    <g key={d.label}>
                        <path
                            d={`M${x0},${base} V${y0 + r} Q${x0},${y0} ${x0 + r},${y0} H${x0 + barW - r} Q${x0 + barW},${y0} ${x0 + barW},${y0 + r} V${base} Z`}
                            fill={STEP_COLORS[i % STEP_COLORS.length]}
                        >
                            <title>{`${d.label}: ${d.energy} J`}</title>
                        </path>
                        <text x={cx} y={height - 4} className={s['EnergyDashboard__Label']} textAnchor="middle">
                            {d.label}
                        </text>
                    </g>
                )
            })}
        </svg>
    )
}

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
                <p>{data.timestamp.replace('T', ' ').slice(0, 16)} UTC</p>
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
                <EnergyChart data={chartData} />
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
