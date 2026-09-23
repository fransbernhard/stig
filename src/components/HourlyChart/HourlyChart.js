import { niceScale } from '@/lib/chart'
import s from './HourlyChart.module.scss'

// Plain SVG instead of a chart library — native <title> tooltips, no extra JS
const WIDTH = 320
const HEIGHT = 120
const PAD = { top: 20, right: 8, bottom: 18, left: 30 }
const PLOT_W = WIDTH - PAD.left - PAD.right
const PLOT_H = HEIGHT - PAD.top - PAD.bottom

export default function HourlyChart({ data, color = '#6366f1', label, unit, who, nowHour }) {
    const nowValue = data.find((d) => d.hour === nowHour)?.value

    const values = data.map((d) => d.value).filter((v) => v != null)
    const { max, ticks } = niceScale(values.length ? Math.max(...values) : 0)

    const step = PLOT_W / Math.max(data.length - 1, 1)
    const x = (i) => PAD.left + i * step
    const y = (v) => PAD.top + PLOT_H - (v / max) * PLOT_H

    // Split the line wherever a value is missing
    const segments = []
    let current = []
    data.forEach((d, i) => {
        if (d.value == null) {
            if (current.length) segments.push(current)
            current = []
        } else {
            current.push(`${x(i).toFixed(1)},${y(d.value).toFixed(1)}`)
        }
    })
    if (current.length) segments.push(current)

    const nowIdx = data.findIndex((d) => d.hour === nowHour)

    return (
        <div className={s.HourlyChart}>
            <p className={s['HourlyChart__Title']}>
                {label} <span className={s['HourlyChart__Unit']}>({unit})</span>
                {nowValue != null && (
                    <span className={s['HourlyChart__Now']}>
                        · Nu: {nowValue.toFixed(1)} {unit}
                    </span>
                )}
            </p>
            <svg
                className={s['HourlyChart__Svg']}
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                role="img"
                aria-label={`${label} per timme`}
            >
                {ticks.map((t) => (
                    <text key={t} x={PAD.left - 6} y={y(t)} className={s['HourlyChart__Tick']} textAnchor="end" dominantBaseline="middle">
                        {t}
                    </text>
                ))}
                {data.map((d, i) =>
                    i % 3 === 0 ? (
                        <text key={d.hour + i} x={x(i)} y={HEIGHT - 4} className={s['HourlyChart__Tick']} textAnchor="middle">
                            {d.hour}
                        </text>
                    ) : null
                )}

                {who && who <= max && (
                    <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y(who)} y2={y(who)} stroke="#f87171" strokeDasharray="4 2" />
                )}

                {nowIdx >= 0 && (
                    <g>
                        <line x1={x(nowIdx)} x2={x(nowIdx)} y1={PAD.top} y2={PAD.top + PLOT_H} stroke="#111827" strokeDasharray="3 3" />
                        <text x={x(nowIdx)} y={PAD.top - 6} className={s['HourlyChart__NowLabel']} textAnchor="middle">
                            Nu
                        </text>
                    </g>
                )}

                {segments.map((points, i) => (
                    <polyline key={i} points={points.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                ))}

                {data.map((d, i) => (
                    <rect key={i} x={x(i) - step / 2} y={PAD.top} width={step} height={PLOT_H} className={s['HourlyChart__Hit']}>
                        <title>{`${d.hour}:00 — ${d.value != null ? `${d.value.toFixed(1)} ${unit}` : 'ingen data'}`}</title>
                    </rect>
                ))}
            </svg>
        </div>
    )
}
