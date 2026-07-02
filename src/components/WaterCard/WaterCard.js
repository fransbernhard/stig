'use client'

import { useState } from 'react'
import s from './WaterCard.module.scss'

export default function WaterCard({ bathingWater, adviceAgainstBathing, abnormalSituations }) {
    const [expanded, setExpanded] = useState(false)
    const hasAdvisory = adviceAgainstBathing?.length > 0
    const municipality = bathingWater.municipality?.name
    const type = bathingWater.waterTypeIdText

    const reasons = [
        ...(adviceAgainstBathing ?? []).map((a) => a.typeIdText),
        ...(abnormalSituations ?? []).map((a) => a.description),
    ].filter(Boolean).filter((r, i, arr) => arr.indexOf(r) === i)

    return (
        <li className={`${s.WaterCard} ${hasAdvisory ? s['WaterCard--Warn'] : s['WaterCard--Ok']}`}>
            <div className={s['WaterCard__Row']}>
                <span className={s['WaterCard__Dot']} aria-hidden="true" />
                <span className={s['WaterCard__Name']}>{bathingWater.name}</span>
                <span className={s['WaterCard__Meta']}>
                    {[municipality, type].filter(Boolean).join(' · ')}
                </span>
                {hasAdvisory && (
                    <button
                        className={s['WaterCard__InfoBtn']}
                        onClick={() => setExpanded((v) => !v)}
                        aria-label={expanded ? 'Dölj anledning' : 'Visa anledning'}
                        aria-expanded={expanded}
                    >
                        i
                    </button>
                )}
            </div>
            {expanded && reasons.length > 0 && (
                <ul className={s['WaterCard__Reasons']}>
                    {reasons.map((r, i) => (
                        <li key={i} className={s['WaterCard__Reason']}>{r}</li>
                    ))}
                </ul>
            )}
        </li>
    )
}
