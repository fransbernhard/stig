// PDF URLs — stable paths, updated in-place by SVOA
const PDF_URLS = {
    sodra: 'https://www.stockholmvattenochavfall.se/globalassets/pdfer/rapporter/dricksvatten/dricksvattenkvalitet/dricksvattenkvalitet-anvandare_sodra-stockholm_huddinge.pdf',
    nordvastra: 'https://www.stockholmvattenochavfall.se/globalassets/pdfer/rapporter/dricksvatten/dricksvattenkvalitet/dricksvattenkvalitet-anvandare_nordvastra-stockholm.pdf',
}

// Which parameters to display and how
// unitOverride / limitOverride: fix PDF parsing edge cases for specific params
export const DISPLAY_PARAMS = [
    { key: 'E. coli',                    label: 'E. coli',          category: 'Mikrobiologi' },
    { key: 'Intestinala enterokocker',   label: 'Enterokocker',     category: 'Mikrobiologi' },
    { key: 'pH',                         label: 'pH',               category: 'Kemisk' },
    { key: 'Total hårdhet',              label: 'Hårdhet',          category: 'Kemisk' },
    { key: 'Turbiditet',                 label: 'Turbiditet',       category: 'Kemisk' },
    { key: 'Bly',                        label: 'Bly (Pb)',         category: 'Metaller' },
    { key: 'Järn',                       label: 'Järn (Fe)',        category: 'Metaller' },
    { key: 'Koppar',                     label: 'Koppar (Cu)',      category: 'Metaller' },
    { key: 'PFAS 4',                     label: 'PFAS 4',           category: 'PFAS' },
    { key: 'PFAS 21',                    label: 'PFAS 21',          category: 'PFAS' },
    // Nitrat: PDF has subscript "NO₃-N" that strips to "NO", and a dash separator before the limit
    { key: 'Nitrat',                     label: 'Nitrat',           category: 'Kemisk',       unitOverride: 'mg/l', limitOverride: 50 },
    { key: 'Vattentemperatur',           label: 'Temperatur',       category: 'Fysikalisk' },
]

async function extractTextRows(arrayBuffer) {
    const { pathToFileURL } = await import('url')
    const { join } = await import('path')
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
    pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(
        join(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')
    ).href

    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise
    const allItems = []

    for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p)
        const vp = page.getViewport({ scale: 1.0 })
        const tc = await page.getTextContent()

        for (const item of tc.items) {
            if (!item.str?.trim()) continue
            allItems.push({
                str: item.str.trim(),
                x: item.transform[4],
                // Convert bottom-up PDF coords → top-down, offset by page
                y: (p - 1) * 100000 + (vp.height - item.transform[5]),
            })
        }
    }

    allItems.sort((a, b) => a.y - b.y || a.x - b.x)

    // Cluster items with y within 4 points as same row
    const rows = []
    for (const item of allItems) {
        const last = rows[rows.length - 1]
        if (last && item.y - last.refY <= 4) {
            last.items.push(item)
        } else {
            rows.push({ refY: item.y, items: [item] })
        }
    }

    return rows.map((r) => r.items.sort((a, b) => a.x - b.x).map((i) => i.str))
}

function toNumeric(str) {
    if (!str) return null
    // Strip leading < / > and normalise Swedish decimal comma → dot
    const n = parseFloat(str.replace(',', '.').replace(/^[<>]\s*/, ''))
    return isNaN(n) ? null : n
}

function extractParam(rows, paramKey) {
    for (const row of rows) {
        if (row[0] !== paramKey) continue

        const numericRe = /^[<>]?\s*[\d,]+/
        const valueIdx = row.findIndex((t, i) => i > 0 && numericRe.test(t))
        if (valueIdx < 0) continue

        const unit = row.slice(1, valueIdx).filter((t) => !t.match(/^[A-Z][a-z]?\d*[+-]?$/)).join(' ')
        const valueRaw = row[valueIdx]
        const limitRaw = row.slice(valueIdx + 1).join(' ')

        // Påvisad means "any detection = violation" — microbiological safety indicator
        const isPavisad = limitRaw.toLowerCase().includes('påvisad')

        // Range limit: "≥ 6,5 och ≤ 9,5" (e.g. pH)
        const rangeMatch = limitRaw.match(/≥\s*([\d,]+).*≤\s*([\d,]+)/)
        const isRange = !!rangeMatch
        const limitMin = rangeMatch ? toNumeric(rangeMatch[1]) : null
        const limitMax = rangeMatch ? toNumeric(rangeMatch[2]) : null

        // No legal limit when limitRaw is just a dash
        const hasNoLimit = !isPavisad && !isRange && limitRaw.trim() === '-'

        return {
            unit,
            valueRaw,
            valueNumeric: toNumeric(valueRaw),
            limitRaw,
            limitNumeric: isPavisad || isRange ? null : toNumeric(row[valueIdx + 1] ?? ''),
            isPavisad,
            isRange,
            limitMin,
            limitMax,
            hasNoLimit,
        }
    }
    return null
}

async function parsePdf(url) {
    const res = await fetch(url, { next: { revalidate: 86400 } })
    if (!res.ok) return null
    const rows = await extractTextRows(await res.arrayBuffer())

    // Extract date from header row (e.g. "Datum 2026-03-30")
    const datumRow = rows.find((r) => r.join(' ').includes('Datum'))
    const dateMatch = datumRow?.join(' ').match(/(\d{4}-\d{2}-\d{2})/)
    const date = dateMatch?.[1] ?? null

    const params = {}
    for (const p of DISPLAY_PARAMS) {
        const result = extractParam(rows, p.key)
        if (result) params[p.key] = result
    }

    return { date, params }
}

export async function fetchDrinkingWaterData() {
    const [sodra, nordvastra] = await Promise.all([
        parsePdf(PDF_URLS.sodra).catch(() => null),
        parsePdf(PDF_URLS.nordvastra).catch(() => null),
    ])
    return { sodra, nordvastra }
}
