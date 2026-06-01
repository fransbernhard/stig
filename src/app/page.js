import { fetchAirQuality, getCurrentHourIndex } from '@/lib/air-quality'
import { POLLUTANTS } from '@/lib/aqi'
import AQIHero from '@/components/AQIHero'
import PollutantCard from '@/components/PollutantCard'
import HourlyChart from '@/components/HourlyChart'
import PollenStrip from '@/components/PollenStrip'
import styles from './page.module.css'

export const revalidate = 3600

const CHART_COLORS = {
  pm2_5:            '#6366f1',
  pm10:             '#8b5cf6',
  nitrogen_dioxide: '#f59e0b',
  ozone:            '#10b981',
  sulphur_dioxide:  '#ef4444',
  carbon_monoxide:  '#64748b',
}

export default async function Page() {
  let data, error

  try {
    data = await fetchAirQuality()
  } catch (e) {
    error = e.message
  }

  if (error || !data) {
    return (
      <main className={styles.main}>
        <p className={styles.error}>Could not load air quality data. Try again later.</p>
      </main>
    )
  }

  const { hourly } = data
  const idx = getCurrentHourIndex(hourly.time)

  const chartData = (key) =>
    hourly.time.map((t, i) => ({
      hour: t.slice(11, 13),
      value: hourly[key]?.[i] ?? null,
    }))

  return (
    <main className={styles.main}>
      <AQIHero aqi={hourly.european_aqi?.[idx]} />

      <section className={styles.grid}>
        {POLLUTANTS.map((p) => (
          <PollutantCard
            key={p.key}
            label={p.label}
            value={hourly[p.key]?.[idx]}
            unit={p.unit}
            who={p.who}
          />
        ))}
      </section>

      <PollenStrip hourly={hourly} idx={idx} />

      <section className={styles.charts}>
        {POLLUTANTS.slice(0, 4).map((p) => (
          <HourlyChart
            key={p.key}
            label={p.label}
            unit={p.unit}
            who={p.who}
            color={CHART_COLORS[p.key]}
            data={chartData(p.key)}
          />
        ))}
      </section>

      <footer className={styles.footer}>
        Data: <a href="https://open-meteo.com" target="_blank" rel="noopener">Open-Meteo</a>
        {' '}(CAMS/SMHI) · Updated hourly
      </footer>
    </main>
  )
}
