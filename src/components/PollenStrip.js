'use client'

import { POLLEN, pollenLevel } from '@/lib/aqi'
import styles from './PollenStrip.module.css'

export default function PollenStrip({ hourly, idx }) {
  return (
    <div className={styles.strip}>
      <p className={styles.heading}>Pollen</p>
      <div className={styles.items}>
        {POLLEN.map(({ key, label }) => {
          const value = hourly[key]?.[idx] ?? null
          const lvl = pollenLevel(value)
          return (
            <div key={key} className={styles.item}>
              <span className={styles.dot} style={{ background: lvl.color }} />
              <span className={styles.name}>{label}</span>
              <span className={styles.lvl}>{lvl.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
