export const AQI_LEVELS = [
    {
        max: 20,
        label: 'Good',
        color: '#4ade80',
        bg: '#f0fdf4',
        text: '#166534',
    },
    {
        max: 40,
        label: 'Fair',
        color: '#a3e635',
        bg: '#f7fee7',
        text: '#3f6212',
    },
    {
        max: 60,
        label: 'Moderate',
        color: '#facc15',
        bg: '#fefce8',
        text: '#854d0e',
    },
    {
        max: 80,
        label: 'Poor',
        color: '#fb923c',
        bg: '#fff7ed',
        text: '#9a3412',
    },
    {
        max: 100,
        label: 'Very Poor',
        color: '#f87171',
        bg: '#fef2f2',
        text: '#991b1b',
    },
    {
        max: Infinity,
        label: 'Extremely Poor',
        color: '#c084fc',
        bg: '#faf5ff',
        text: '#6b21a8',
    },
]

export function getAQILevel(value) {
    return (
        AQI_LEVELS.find((l) => value <= l.max) ??
        AQI_LEVELS[AQI_LEVELS.length - 1]
    )
}

export const POLLUTANTS = [
    { key: 'pm2_5', label: 'PM2.5', unit: 'μg/m³', who: 15 },
    { key: 'pm10', label: 'PM10', unit: 'μg/m³', who: 45 },
    { key: 'nitrogen_dioxide', label: 'NO₂', unit: 'μg/m³', who: 25 },
    { key: 'ozone', label: 'O₃', unit: 'μg/m³', who: 100 },
    { key: 'sulphur_dioxide', label: 'SO₂', unit: 'μg/m³', who: 40 },
    { key: 'carbon_monoxide', label: 'CO', unit: 'μg/m³', who: 4000 },
]

export const POLLEN = [
    { key: 'birch_pollen', label: 'Birch' },
    { key: 'alder_pollen', label: 'Alder' },
    { key: 'grass_pollen', label: 'Grass' },
]

export function pollenLevel(value) {
    if (value == null) return { label: '—', color: '#9ca3af' }
    if (value < 10) return { label: 'Low', color: '#4ade80' }
    if (value < 100) return { label: 'Moderate', color: '#facc15' }
    if (value < 1000) return { label: 'High', color: '#fb923c' }
    return { label: 'Very High', color: '#f87171' }
}
