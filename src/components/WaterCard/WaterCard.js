import s from './WaterCard.module.scss'

export default function WaterCard({ bathingWater, adviceAgainstBathing, abnormalSituations }) {
    const hasAdvisory = adviceAgainstBathing?.length > 0
    const municipality = bathingWater.municipality?.name
    const type = bathingWater.waterTypeIdText

    const reasons = [
        ...(adviceAgainstBathing ?? []).map((a) => a.typeIdText),
        ...(abnormalSituations ?? []).map((a) => a.description),
    ].filter(Boolean).filter((r, i, arr) => arr.indexOf(r) === i)

    // Read by WaterSearch to filter the server-rendered list
    const searchText = [bathingWater.name, municipality, type].filter(Boolean).join(' ').toLowerCase()

    return (
        <li
            className={`${s.WaterCard} ${hasAdvisory ? s['WaterCard--Warn'] : s['WaterCard--Ok']}`}
            data-search={searchText}
            data-advisory={hasAdvisory || undefined}
        >
            <div className={s['WaterCard__Row']}>
                <span className={s['WaterCard__Dot']} aria-hidden="true" />
                <div className={s['WaterCard__Body']}>
                    <span className={s['WaterCard__Name']}>{bathingWater.name}</span>
                    {reasons.length > 0 && (
                        <ul className={s['WaterCard__Reasons']}>
                            {reasons.map((r, i) => (
                                <li key={i} className={s['WaterCard__Reason']}>{r}</li>
                            ))}
                        </ul>
                    )}
                </div>
                <span className={s['WaterCard__Meta']}>
                    {[municipality, type].filter(Boolean).join(' · ')}
                </span>
            </div>
        </li>
    )
}
