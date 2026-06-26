'use client'

import { POLLEN, pollenLevel } from '@/lib/aqi'
import s from './PollenStrip.module.scss'

export default function PollenStrip({ hourly, idx }) {
    return (
        <div className={s.PollenStrip}>
            <p className={s['PollenStrip__Heading']}>Pollen</p>
            <div className={s['PollenStrip__Items']}>
                {POLLEN.map(({ key, label }) => {
                    const value = hourly[key]?.[idx] ?? null
                    const lvl = pollenLevel(value)
                    return (
                        <div key={key} className={s['PollenStrip__Item']}>
                            <span className={s['PollenStrip__Dot']} style={{ background: lvl.color }} />
                            <span className={s['PollenStrip__Name']}>{label}</span>
                            <span className={s['PollenStrip__Level']}>{lvl.label}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
