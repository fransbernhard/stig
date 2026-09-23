import { writeFileSync } from 'fs'
import { fetchStockholmWaterQuality } from '../src/lib/water-quality.js'

const MAX_ATTEMPTS = 3
const RETRY_DELAY_MS = 5000

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let sites
for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
        sites = await fetchStockholmWaterQuality({
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; stig/1.0)' },
        })
        break
    } catch (err) {
        console.error(`Attempt ${attempt}/${MAX_ATTEMPTS} failed: ${err.message}`)
        if (attempt === MAX_ATTEMPTS) process.exit(1)
        await sleep(RETRY_DELAY_MS)
    }
}

writeFileSync('water.json', JSON.stringify({ fetchedAt: new Date().toISOString(), sites }, null, 2))
console.log(`Saved ${sites.length} sites (${sites.filter(s => s.adviceAgainstBathing?.length).length} with advisories)`)
