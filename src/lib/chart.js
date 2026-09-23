// Rounds an axis up to a "nice" max (1, 2 or 5 × 10ⁿ steps) and returns its tick values
export function niceScale(dataMax, tickCount = 3) {
    if (!(dataMax > 0)) return { max: 1, ticks: [0, 1] }

    const rawStep = dataMax / tickCount
    const magnitude = 10 ** Math.floor(Math.log10(rawStep))
    const normalized = rawStep / magnitude
    const step = (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10) * magnitude
    const max = Math.ceil(dataMax / step) * step

    const ticks = []
    for (let t = 0; t <= max + step / 2; t += step) ticks.push(Number(t.toPrecision(6)))
    return { max, ticks }
}
