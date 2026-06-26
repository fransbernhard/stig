'use client'

import { getAQILevel } from '@/lib/aqi'
import s from './AQIHero.module.scss'

export default function AQIHero({ aqi }) {
    const level = getAQILevel(aqi ?? 0)

    return (
        <div className={s.AQIHero} style={{ background: level.bg }}>
            <p className={s['AQIHero__City']}>Stockholm</p>
            <div className={s['AQIHero__Circle']} style={{ borderColor: level.color }}>
                <span className={s['AQIHero__Value']}>{aqi ?? '—'}</span>
                <span className={s['AQIHero__Unit']}>EU AQI</span>
            </div>
            <p className={s['AQIHero__Label']} style={{ color: level.text }}>
                {level.label}
            </p>
            <p className={s['AQIHero__Sub']}>Air quality right now</p>
        </div>
    )
}
