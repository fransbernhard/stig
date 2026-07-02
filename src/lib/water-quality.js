const BASE_URL = 'https://gw.havochvatten.se/external-public/bathing-waters/v2'

export async function fetchStockholmWaterQuality() {
    const res = await fetch(`${BASE_URL}/bathing-waters`, {
        next: { revalidate: 3600 },
        headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; stig/1.0)',
        },
    })
    if (!res.ok) throw new Error(`Waters ${res.status}`)
    const { watersAndAdvisories } = await res.json()

    const STOCKHOLM_LAN = new Set([
        'Botkyrka', 'Danderyd', 'Ekerö', 'Haninge', 'Huddinge',
        'Järfälla', 'Lidingö', 'Nacka', 'Norrtälje', 'Nykvarn',
        'Nynäshamn', 'Salem', 'Sigtuna', 'Sollentuna', 'Solna',
        'Stockholm', 'Sundbyberg', 'Södertälje', 'Tyresö', 'Täby',
        'Upplands Väsby', 'Upplands-Bro', 'Vallentuna', 'Vaxholm',
        'Värmdö', 'Österåker',
    ])

    const stockholm = watersAndAdvisories.filter(
        (w) => STOCKHOLM_LAN.has(w.bathingWater.municipality?.name)
    )

    stockholm.sort((a, b) => {
        const aAdv = a.adviceAgainstBathing?.length > 0 ? 1 : 0
        const bAdv = b.adviceAgainstBathing?.length > 0 ? 1 : 0
        if (aAdv !== bAdv) return bAdv - aAdv
        return a.bathingWater.name.localeCompare(b.bathingWater.name, 'sv')
    })

    return stockholm
}
