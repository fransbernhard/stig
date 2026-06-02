const BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'

const STOCKHOLM = { latitude: 59.33, longitude: 18.07 }

const HOURLY_VARS = [
    'pm10',
    'pm2_5',
    'nitrogen_dioxide',
    'ozone',
    'sulphur_dioxide',
    'carbon_monoxide',
    'european_aqi',
    'alder_pollen',
    'birch_pollen',
    'grass_pollen',
].join(',')

export async function fetchAirQuality() {
    const params = new URLSearchParams({
        latitude: STOCKHOLM.latitude,
        longitude: STOCKHOLM.longitude,
        hourly: HOURLY_VARS,
        forecast_days: '1',
        timezone: 'Europe/Stockholm',
    })

    const res = await fetch(`${BASE_URL}?${params}`, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Air quality fetch failed: ${res.status}`)
    return res.json()
}

export function getCurrentHourIndex(times) {
    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const currentHour = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:00`
    const idx = times.indexOf(currentHour)
    return idx === -1 ? times.length - 1 : idx
}
