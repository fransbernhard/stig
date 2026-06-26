import s from './WaterCard.module.scss'

export default function WaterCard({ bathingWater, adviceAgainstBathing, abnormalSituations }) {
    const hasAdvisory = adviceAgainstBathing?.length > 0
    const hasAbnormal = abnormalSituations?.length > 0

    return (
        <div className={`${s.WaterCard} ${hasAdvisory ? s['WaterCard--Warn'] : s['WaterCard--Ok']}`}>
            <div className={s['WaterCard__Top']}>
                <p className={s['WaterCard__Name']}>{bathingWater.name}</p>
                <span className={s['WaterCard__Type']}>{bathingWater.waterTypeIdText ?? '—'}</span>
            </div>
            {hasAdvisory ? (
                <div className={s['WaterCard__Advisory']}>
                    {adviceAgainstBathing.map((a, i) => (
                        <p key={i} className={s['WaterCard__AdvisoryText']}>⚠ {a.typeIdText}</p>
                    ))}
                </div>
            ) : (
                <p className={s['WaterCard__Safe']}>Inga avrådan</p>
            )}
            {hasAbnormal && (
                <p className={s['WaterCard__Abnormal']}>{abnormalSituations[0].description}</p>
            )}
        </div>
    )
}
