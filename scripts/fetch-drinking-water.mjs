import { writeFileSync } from 'fs'
import { fetchDrinkingWaterData } from '../src/lib/drinking-water.js'

const { sodra, nordvastra } = await fetchDrinkingWaterData()

if (!sodra && !nordvastra) {
    console.error('Could not fetch any drinking water report')
    process.exit(1)
}

writeFileSync(
    'drinking-water.json',
    JSON.stringify({ fetchedAt: new Date().toISOString(), sodra, nordvastra }, null, 2)
)
console.log(`Saved drinking water reports (södra: ${sodra?.date ?? 'missing'}, nordvästra: ${nordvastra?.date ?? 'missing'})`)
