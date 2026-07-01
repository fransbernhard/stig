import { fetchDrinkingWaterData, DISPLAY_PARAMS } from '@/lib/drinking-water'
import DrinkingWaterCard from '@/components/DrinkingWaterCard'
import s from './page.module.scss'

function computeStatus(params) {
    const results = []
    for (const p of DISPLAY_PARAMS) {
        const d = params[p.key]
        if (!d) continue
        const effectiveLimit = p.limitOverride ?? d.limitNumeric

        if (d.isPavisad) {
            results.push({ label: p.label, ok: !!d.valueRaw?.startsWith('<') })
        } else if (d.isRange) {
            const v = d.valueNumeric
            results.push({
                label: p.label,
                ok: v !== null && d.limitMin !== null && d.limitMax !== null
                    && v >= d.limitMin && v <= d.limitMax,
            })
        } else if (effectiveLimit) {
            results.push({
                label: p.label,
                ok: d.valueNumeric !== null && d.valueNumeric <= effectiveLimit,
                pct: d.valueNumeric !== null ? Math.round((d.valueNumeric / effectiveLimit) * 100) : null,
            })
        }
    }
    const failing = results.filter((r) => !r.ok)
    return { allOk: failing.length === 0, failing, checked: results.length }
}

function ZoneSection({ report, zoneName }) {
    if (!report || Object.keys(report.params).length === 0) return null
    const status = computeStatus(report.params)
    const pubYear = parseInt(report.date?.slice(0, 4) ?? '0')
    const dataYear = pubYear - 1

    return (
        <section>
            <div className={s['DrinkingWaterPage__ZoneHeader']}>
                <h2 className={s['DrinkingWaterPage__ZoneName']}>{zoneName}</h2>
                <div className={`${s['DrinkingWaterPage__HeroStatus']} ${status.allOk ? s['DrinkingWaterPage__HeroStatus--Ok'] : s['DrinkingWaterPage__HeroStatus--Warn']}`}>
                    {status.allOk ? (
                        <span>Alla {status.checked} parametrar inom gränsvärden</span>
                    ) : (
                        <span>
                            {status.failing.length} parameter{status.failing.length > 1 ? 'ar' : ''} kräver uppmärksamhet:{' '}
                            {status.failing.map((f) => f.pct ? `${f.label} (${f.pct}%)` : f.label).join(', ')}
                        </span>
                    )}
                </div>
            </div>

            <div className={s['DrinkingWaterPage__Grid']}>
                {DISPLAY_PARAMS.map((p) => {
                    const d = report.params[p.key]
                    if (!d) return null
                    return (
                        <DrinkingWaterCard
                            key={p.key}
                            label={p.label}
                            category={p.category}
                            unit={p.unitOverride ?? d.unit}
                            valueRaw={d.valueRaw}
                            valueNumeric={d.valueNumeric}
                            limitRaw={d.limitRaw}
                            limitNumeric={p.limitOverride ?? d.limitNumeric}
                            isPavisad={d.isPavisad}
                            isRange={d.isRange}
                            limitMin={d.limitMin}
                            limitMax={d.limitMax}
                            hasNoLimit={d.hasNoLimit}
                        />
                    )
                })}
            </div>
        </section>
    )
}

export const revalidate = 86400
export const preferredRegion = 'arn1'

export default async function DrinkingWaterPage() {
    let data = null
    let error = null

    try {
        data = await fetchDrinkingWaterData()
    } catch (e) {
        error = e.message
    }

    const { sodra, nordvastra } = data ?? {}
    const primaryReport = sodra ?? nordvastra
    const hasData = primaryReport && Object.keys(primaryReport.params).length > 0
    const pubYear = primaryReport?.date ? parseInt(primaryReport.date.slice(0, 4)) : null
    const dataYear = pubYear ? pubYear - 1 : null

    return (
        <main className={s.DrinkingWaterPage}>
            <header className={s['DrinkingWaterPage__Header']}>
                <h1 className={s['DrinkingWaterPage__Title']}>Dricksvatten i Stockholm</h1>
            </header>

            {error || !hasData ? (
                <p className={s['DrinkingWaterPage__Empty']}>Kunde inte ladda dricksvattendata. Prova igen senare.</p>
            ) : (
                <>
                    {primaryReport?.date && (
                        <div className={s['DrinkingWaterPage__Notice']}>
                            <span className={s['DrinkingWaterPage__NoticeIcon']}>🕐</span>
                            <div>
                                <strong>Årsmedelvärden {dataYear}</strong> — inte realtidsdata.
                                Värdena är medelvärden från ~1 200 prover tagna under hela {dataYear}, publicerade {primaryReport.date}.
                                Nästa uppdatering väntas mars/april {pubYear + 1}.
                            </div>
                        </div>
                    )}
                    <div className={s['DrinkingWaterPage__Zones']}>
                        <ZoneSection report={sodra} zoneName="Södra Stockholm & Huddinge" />
                        <ZoneSection report={nordvastra} zoneName="Nordvästra Stockholm" />
                    </div>
                </>
            )}

            <footer className={s['DrinkingWaterPage__Footer']}>
                Data:{' '}
                <a
                    href="https://www.stockholmvattenochavfall.se/kunskap/dricksvatten/vattenkvalitet/"
                    target="_blank"
                    rel="noopener"
                >
                    Stockholm Vatten och Avfall
                </a>
                {' '}· Källa: Lovö & Norsborgs vattenverk
            </footer>
        </main>
    )
}
