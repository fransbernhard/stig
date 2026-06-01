'use client'

import { getAQILevel } from '@/lib/aqi'
import styles from './AQIHero.module.css'

export default function AQIHero({ aqi }) {
  const level = getAQILevel(aqi ?? 0)

  return (
    <div className={styles.hero} style={{ background: level.bg }}>
      <p className={styles.city}>Stockholm</p>
      <div className={styles.circle} style={{ borderColor: level.color }}>
        <span className={styles.value}>{aqi ?? '—'}</span>
        <span className={styles.unit}>EU AQI</span>
      </div>
      <p className={styles.label} style={{ color: level.text }}>
        {level.label}
      </p>
      <p className={styles.sub}>Air quality right now</p>
    </div>
  )
}
