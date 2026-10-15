// Fails the build if any exported page downloads more than the budget (gzipped HTML + JS + CSS).
// Run after `next build`. Data files fetched at runtime (water.json etc.) are not counted.
import { readFile, readdir } from 'fs/promises'
import { join, relative } from 'path'
import { gzipSync } from 'zlib'

// About 180 kB is React and the Next.js runtime, shared by every page
const BUDGET_KB = 220
const OUT = 'out'
const BASE = process.env.BASE_PATH ?? '/stig'

const gzipKb = (buf) => gzipSync(buf).length / 1024

async function htmlFiles(dir) {
    const entries = await readdir(dir, { withFileTypes: true })
    const files = await Promise.all(
        entries.map((e) => {
            const path = join(dir, e.name)
            if (e.isDirectory()) return e.name === '_next' ? [] : htmlFiles(path)
            return e.name.endsWith('.html') ? [path] : []
        })
    )
    return files.flat()
}

const assetCache = new Map()
async function assetKb(src) {
    if (!assetCache.has(src)) {
        const file = join(OUT, src.replace(BASE, ''))
        assetCache.set(src, gzipKb(await readFile(file)))
    }
    return assetCache.get(src)
}

let failed = false
for (const file of await htmlFiles(OUT)) {
    const html = await readFile(file)
    const assets = new Set(
        [...html.toString().matchAll(/(?:src|href)="([^"]+\/_next\/static\/[^"]+\.(?:js|css))"/g)].map((m) => m[1])
    )
    let kb = gzipKb(html)
    for (const src of assets) kb += await assetKb(src)

    const over = kb > BUDGET_KB
    failed ||= over
    console.log(`${over ? '✗' : '✓'} ${relative(OUT, file).padEnd(24)} ${kb.toFixed(1).padStart(6)} kB`)
}

console.log(`Budget: ${BUDGET_KB} kB per page (gzipped)`)
if (failed) {
    console.error('Over budget — see guideline 5.24 in the Web Sustainability Guidelines.')
    process.exit(1)
}
