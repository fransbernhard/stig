'use client'

import { useEffect, useState, useCallback } from 'react'
import { fetchAirQuality, getCurrentHourIndex } from '@/lib/air-quality'
import { POLLUTANTS } from '@/lib/aqi'
import AQIHero from '@/components/AQIHero'
import PollutantCard from '@/components/PollutantCard'
import HourlyChart from '@/components/HourlyChart'
import PollenStrip from '@/components/PollenStrip'
import s from './page.module.scss'

const REFRESH_INTERVAL_MS = 30 * 60 * 1000

const CHART_COLORS = {
    pm2_5: '#6366f1',
    pm10: '#8b5cf6',
    nitrogen_dioxide: '#f59e0b',
    ozone: '#10b981',
    sulphur_dioxide: '#ef4444',
    carbon_monoxide: '#64748b',
}

export default function Page() {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [updatedAt, setUpdatedAt] = useState(null)

    const load = useCallback(async () => {
        try {
            const result = await fetchAirQuality()
            setData(result)
            setUpdatedAt(new Date())
            setError(null)
        } catch (e) {
            setError(e.message)
        }
    }, [])

    useEffect(() => {
        load()
        const timer = setInterval(load, REFRESH_INTERVAL_MS)
        return () => clearInterval(timer)
    }, [load])

    if (error) {
        return (
            <main className={s.LuftPage}>
                <p className={s['LuftPage__Error']}>Could not load air quality data. Try again later.</p>
            </main>
        )
    }

    if (!data) {
        return (
            <main className={s.LuftPage}>
                <p className={s['LuftPage__Loading']}>Loading…</p>
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

    const updatedLabel = updatedAt
        ? `Updated ${updatedAt.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}`
        : null

    return (
        <main className={s.LuftPage}>
            <AQIHero aqi={hourly.european_aqi?.[idx]} />

            <section className={s['LuftPage__Grid']}>
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

            <section className={s['LuftPage__Charts']}>
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

            <footer className={s['LuftPage__Footer']}>
                Data:{' '}
                <a href="https://open-meteo.com" target="_blank" rel="noopener">
                    Open-Meteo
                </a>{' '}
                (CAMS/SMHI) · {updatedLabel} ·{' '}
                <a href="/energy">Build energy ⚡</a>
            </footer>
        </main>
    )
}
