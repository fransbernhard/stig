import { writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const { fetchStockholmWaterQuality } = await import('../src/lib/water-quality.js')
const { fetchDrinkingWaterData } = await import('../src/lib/drinking-water.js')

async function run() {
    console.log('Fetching bathing water data…')
    const water = await fetchStockholmWaterQuality()
    await writeFile(
        join(root, 'public/data/water.json'),
        JSON.stringify(water, null, 2)
    )
    console.log(`  → ${water.length} sites saved`)

    console.log('Fetching drinking water data (parses PDFs)…')
    const drinkingWater = await fetchDrinkingWaterData()
    await writeFile(
        join(root, 'public/data/drinking-water.json'),
        JSON.stringify(drinkingWater, null, 2)
    )
    const zones = Object.values(drinkingWater).filter(Boolean).length
    console.log(`  → ${zones} zones saved`)
}

run().catch((e) => { console.error(e); process.exit(1) })
