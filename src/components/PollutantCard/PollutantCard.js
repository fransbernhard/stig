'use client'

import s from './PollutantCard.module.scss'

export default function PollutantCard({ label, value, unit, who }) {
    const pct = who ? Math.min((value / who) * 100, 100) : 0
    const barColor = pct < 50 ? '#4ade80' : pct < 80 ? '#facc15' : '#f87171'

    return (
        <div className={s.PollutantCard}>
            <p className={s['PollutantCard__Label']}>{label}</p>
            <p className={s['PollutantCard__Value']}>
                {value != null ? value.toFixed(1) : '—'}
                <span className={s['PollutantCard__Unit']}> {unit}</span>
            </p>
            {who && (
                <div className={s['PollutantCard__BarTrack']}>
                    <div
                        className={s['PollutantCard__BarFill']}
                        style={{ width: `${pct}%`, background: barColor }}
                    />
                </div>
            )}
            {who && (
                <p className={s['PollutantCard__Who']}>
                    WHO guideline: {who} {unit}
                </p>
            )}
        </div>
    )
}
