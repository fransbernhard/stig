'use client'

import { useEffect, useState } from 'react'
import { niceScale } from '@/lib/chart'
import { useElementWidth } from '@/lib/useElementWidth'
import s from './EnergyDashboard.module.scss'

// Written into the export by the deploy workflow after the build is measured
const ENERGY_URL = `${process.env.NEXT_PUBLIC_BASE_PATH}/energy.json`

const STEP_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa']

const CHART = { height: 160, top: 8, right: 8, bottom: 20, left: 34, maxBar: 80, radius: 4 }

// Plain SVG instead of a chart library
function EnergyChart({ data }) {
    const [wrapperRef, width] = useElementWidth(320)
    const { height, top, right, bottom, left, maxBar, radius } = CHART
    const plotW = width - left - right
    const plotH = height - top - bottom
    const { max, ticks } = niceScale(Math.max(0, ...data.map((d) => d.energy)))

    const slot = plotW / Math.max(data.length, 1)
    const barW = Math.min(maxBar, slot * 0.8)
    const y = (v) => top + plotH - (v / max) * plotH

    return (
        <div ref={wrapperRef}>
            <svg className={s['EnergyDashboard__Svg']} width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Energi per steg i joule">
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
        </div>
    )
}

export default function EnergyDashboard() {
    const [data, setData] = useState(null)
    const [status, setStatus] = useState('loading')

    useEffect(() => {
        fetch(ENERGY_URL, { cache: 'no-cache' })
            .then((res) => (res.ok ? res.json() : Promise.reject()))
            .then((json) => {
                setData(json)
                setStatus('ready')
            })
            .catch(() => setStatus('missing'))
    }, [])

    if (status === 'loading') return <p className={s['EnergyDashboard__Empty']}>Laddar…</p>
    if (status === 'missing') {
        return (
            <p className={s['EnergyDashboard__Empty']}>
                Det finns ingen mätning att visa. Energin mäts bara när sajten byggs och publiceras via
                GitHub Actions, inte när den körs lokalt.
            </p>
        )
    }

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
                    Körning #{data.run_id} ↗
                </a>
            </div>

            <div className={s['EnergyDashboard__Totals']}>
                <div className={s['EnergyDashboard__Stat']}>
                    <span className={s['EnergyDashboard__StatValue']}>
                        {totalEnergy.toFixed(2)}
                        {deltaPct !== null && (
                            <span
                                className={`${s['EnergyDashboard__Delta']} ${deltaPct > 0 ? s['EnergyDashboard__Delta--Up'] : s['EnergyDashboard__Delta--Down']}`}
                                title="Jämfört med förra bygget"
                            >
                                {deltaPct > 0 ? '▲' : '▼'} {Math.abs(deltaPct).toFixed(1)}%
                            </span>
                        )}
                    </span>
                    <span className={s['EnergyDashboard__StatLabel']}>total energi (J)</span>
                </div>
                <div className={s['EnergyDashboard__Stat']}>
                    <span className={s['EnergyDashboard__StatValue']}>{totalTime.toFixed(1)}</span>
                    <span className={s['EnergyDashboard__StatLabel']}>total tid (s)</span>
                </div>
            </div>

            <p className={s['EnergyDashboard__Compare']}>
                {deltaPct !== null && <>{deltaPct > 0 ? 'Högre' : 'Lägre'} än förra bygget. </>}
                Det motsvarar en 10 W LED-lampa som lyser i ungefär {Math.round(totalEnergy / 10)} sekunder.
            </p>

            <div className={s['EnergyDashboard__Chart']}>
                <p className={s['EnergyDashboard__ChartTitle']}>Energi per steg (J)</p>
                <EnergyChart data={chartData} />
            </div>

            <div className={s['EnergyDashboard__Table']}>
                <div className={`${s['EnergyDashboard__Row']} ${s['EnergyDashboard__Row--Head']}`}>
                    <span>Steg</span>
                    <span>Energi (J)</span>
                    <span>Tid (s)</span>
                    <span>CPU (snitt)</span>
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
