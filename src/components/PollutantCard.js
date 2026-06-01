'use client'

import styles from './PollutantCard.module.css'

export default function PollutantCard({ label, value, unit, who }) {
  const pct = who ? Math.min((value / who) * 100, 100) : 0
  const barColor = pct < 50 ? '#4ade80' : pct < 80 ? '#facc15' : '#f87171'

  return (
    <div className={styles.card}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>
        {value != null ? value.toFixed(1) : '—'}
        <span className={styles.unit}> {unit}</span>
      </p>
      {who && (
        <div className={styles.barTrack}>
          <div
            className={styles.barFill}
            style={{ width: `${pct}%`, background: barColor }}
          />
        </div>
      )}
      {who && (
        <p className={styles.who}>WHO guideline: {who} {unit}</p>
      )}
    </div>
  )
}
