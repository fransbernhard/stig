const BASE_URL = 'https://gw.havochvatten.se/external-public/bathing-waters/v2'

export async function fetchStockholmWaterQuality() {
    const res = await fetch(`${BASE_URL}/bathing-waters`, {
        next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error(`Waters ${res.status}`)
    const { watersAndAdvisories } = await res.json()

    const stockholm = watersAndAdvisories.filter(
        (w) => w.bathingWater.municipality?.name === 'Stockholm'
    )

    // Advisories first, then alphabetical
    stockholm.sort((a, b) => {
        const aAdv = a.adviceAgainstBathing?.length > 0 ? 1 : 0
        const bAdv = b.adviceAgainstBathing?.length > 0 ? 1 : 0
        if (aAdv !== bAdv) return bAdv - aAdv
        return a.bathingWater.name.localeCompare(b.bathingWater.name, 'sv')
    })

    return stockholm
}
