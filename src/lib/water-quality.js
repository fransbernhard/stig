const BASE_URL = 'https://gw.havochvatten.se/external-public/bathing-waters/v2'

export async function fetchStockholmWaterQuality() {
    if (typeof window !== 'undefined') {
        const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
        const res = await fetch(`${base}/data/water.json`)
        if (!res.ok) throw new Error(`Cache ${res.status}`)
        return res.json()
    }

    const res = await fetch(`${BASE_URL}/bathing-waters`, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Waters ${res.status}`)
    const { watersAndAdvisories } = await res.json()

    const stockholm = watersAndAdvisories.filter(
        (w) => w.bathingWater.municipality?.name === 'Stockholm'
    )

    stockholm.sort((a, b) => {
        const aAdv = a.adviceAgainstBathing?.length > 0 ? 1 : 0
        const bAdv = b.adviceAgainstBathing?.length > 0 ? 1 : 0
        if (aAdv !== bAdv) return bAdv - aAdv
        return a.bathingWater.name.localeCompare(b.bathingWater.name, 'sv')
    })

    return stockholm
}
