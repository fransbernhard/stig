'use client'

import { getAQILevel } from '@/lib/aqi'
import s from './AQIHero.module.scss'

export default function AQIHero({ aqi }) {
    const level = getAQILevel(aqi ?? 0)

    return (
        <div className={s.AQIHero} style={{ '--aqi-color': level.color, '--aqi-bg': level.bg, '--aqi-text': level.text }}>
            <p className={s['AQIHero__City']}>Stockholm</p>
            <div className={s['AQIHero__Circle']}>
                <span className={s['AQIHero__Value']}>{aqi ?? '—'}</span>
                <span className={s['AQIHero__Unit']}>EU AQI</span>
            </div>
            <p className={s['AQIHero__Label']}>
                {level.label}
            </p>
            <p className={s['AQIHero__Sub']}>Luftkvalitet just nu</p>
        </div>
    )
}
