import { writeFileSync } from 'fs'

const BASE_URL = 'https://gw.havochvatten.se/external-public/bathing-waters/v2'

const STOCKHOLM_LAN = new Set([
    'Botkyrka', 'Danderyd', 'Ekerö', 'Haninge', 'Huddinge',
    'Järfälla', 'Lidingö', 'Nacka', 'Norrtälje', 'Nykvarn',
    'Nynäshamn', 'Salem', 'Sigtuna', 'Sollentuna', 'Solna',
    'Stockholm', 'Sundbyberg', 'Södertälje', 'Tyresö', 'Täby',
    'Upplands Väsby', 'Upplands-Bro', 'Vallentuna', 'Vaxholm',
    'Värmdö', 'Österåker',
])

const res = await fetch(BASE_URL + '/bathing-waters', {
    headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; stig/1.0)',
    },
})

if (!res.ok) {
    console.error(`HaV API responded ${res.status}`)
    process.exit(1)
}

const { watersAndAdvisories } = await res.json()

const sites = watersAndAdvisories
    .filter((w) => STOCKHOLM_LAN.has(w.bathingWater.municipality?.name))
    .sort((a, b) => {
        const aAdv = a.adviceAgainstBathing?.length > 0 ? 1 : 0
        const bAdv = b.adviceAgainstBathing?.length > 0 ? 1 : 0
        if (aAdv !== bAdv) return bAdv - aAdv
        return a.bathingWater.name.localeCompare(b.bathingWater.name, 'sv')
    })

writeFileSync('water.json', JSON.stringify({ fetchedAt: new Date().toISOString(), sites }, null, 2))
console.log(`Saved ${sites.length} sites (${sites.filter(s => s.adviceAgainstBathing?.length).length} with advisories)`)
