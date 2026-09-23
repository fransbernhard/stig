const BASE_URL = 'https://gw.havochvatten.se/external-public/bathing-waters/v2'

const STOCKHOLM_LAN = new Set([
    'Botkyrka', 'Danderyd', 'Ekerö', 'Haninge', 'Huddinge',
    'Järfälla', 'Lidingö', 'Nacka', 'Norrtälje', 'Nykvarn',
    'Nynäshamn', 'Salem', 'Sigtuna', 'Sollentuna', 'Solna',
    'Stockholm', 'Sundbyberg', 'Södertälje', 'Tyresö', 'Täby',
    'Upplands Väsby', 'Upplands-Bro', 'Vallentuna', 'Vaxholm',
    'Värmdö', 'Österåker',
])

// Keep only the fields WaterCard shows — the full API objects are ~4× larger
function trimSite({ bathingWater, adviceAgainstBathing, abnormalSituations }) {
    return {
        bathingWater: {
            id: bathingWater.id,
            name: bathingWater.name,
            municipality: { name: bathingWater.municipality?.name },
            waterTypeIdText: bathingWater.waterTypeIdText,
        },
        adviceAgainstBathing: (adviceAgainstBathing ?? []).map(({ typeIdText }) => ({ typeIdText })),
        abnormalSituations: (abnormalSituations ?? []).map(({ description }) => ({ description })),
    }
}

// Stockholms län only, sites with advisories first, then alphabetical
export function toStockholmSites(watersAndAdvisories) {
    return watersAndAdvisories
        .filter((w) => STOCKHOLM_LAN.has(w.bathingWater.municipality?.name))
        .map(trimSite)
        .sort((a, b) => {
            const aAdv = a.adviceAgainstBathing?.length > 0 ? 1 : 0
            const bAdv = b.adviceAgainstBathing?.length > 0 ? 1 : 0
            if (aAdv !== bAdv) return bAdv - aAdv
            return a.bathingWater.name.localeCompare(b.bathingWater.name, 'sv')
        })
}

// HaV blocks most datacenter IPs (GitHub Actions, Vercel), so run this locally via `npm run fetch-data`
export async function fetchStockholmWaterQuality({ headers, ...init } = {}) {
    const res = await fetch(`${BASE_URL}/bathing-waters`, {
        ...init,
        headers: { Accept: 'application/json', ...headers },
    })
    if (!res.ok) throw new Error(`HaV API responded ${res.status}`)
    const { watersAndAdvisories } = await res.json()
    return toStockholmSites(watersAndAdvisories)
}
