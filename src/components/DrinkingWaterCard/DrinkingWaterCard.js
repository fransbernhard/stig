import s from './DrinkingWaterCard.module.scss'

function barColor(p) {
    if (p < 50) return '#15803d'
    if (p < 80) return '#e17426'
    return '#b91c1c'
}

export default function DrinkingWaterCard({
    label, category, unit,
    valueRaw, valueNumeric, limitRaw, limitNumeric, isPavisad,
    isRange, limitMin, limitMax, hasNoLimit,
}) {
    if (isPavisad) {
        const notDetected = valueRaw?.startsWith('<')
        return (
            <div className={s.DrinkingWaterCard}>
                <div className={s['DrinkingWaterCard__Header']}>
                    <p className={s['DrinkingWaterCard__Label']}>{label}</p>
                    <span className={s['DrinkingWaterCard__Category']}>{category}</span>
                </div>
                <p className={s['DrinkingWaterCard__Value']} style={{ color: notDetected ? '#15803d' : '#f87171' }}>
                    {notDetected ? 'Ej påvisad' : 'Påvisad'}
                </p>
                <p className={s['DrinkingWaterCard__Limit']}>Gränsvärde: får ej påvisas</p>
            </div>
        )
    }

    if (isRange) {
        const inRange = valueNumeric !== null && limitMin !== null && limitMax !== null
            && valueNumeric >= limitMin && valueNumeric <= limitMax
        const limitMinStr = String(limitMin).replace('.', ',')
        const limitMaxStr = String(limitMax).replace('.', ',')
        return (
            <div className={s.DrinkingWaterCard}>
                <div className={s['DrinkingWaterCard__Header']}>
                    <p className={s['DrinkingWaterCard__Label']}>{label}</p>
                    <span className={s['DrinkingWaterCard__Category']}>{category}</span>
                </div>
                <p className={s['DrinkingWaterCard__Value']} style={{ color: inRange ? '#15803d' : '#f87171' }}>
                    {valueRaw ?? '—'}
                    {unit && <span className={s['DrinkingWaterCard__Unit']}> {unit}</span>}
                </p>
                <p className={s['DrinkingWaterCard__Limit']}>Gränsvärde: {limitMinStr}–{limitMaxStr} {unit}</p>
            </div>
        )
    }

    const pct = limitNumeric && valueNumeric !== null
        ? Math.min((valueNumeric / limitNumeric) * 100, 100)
        : null

    return (
        <div className={s.DrinkingWaterCard}>
            <div className={s['DrinkingWaterCard__Header']}>
                <p className={s['DrinkingWaterCard__Label']}>{label}</p>
                <span className={s['DrinkingWaterCard__Category']}>{category}</span>
            </div>
            <p className={s['DrinkingWaterCard__Value']}>
                {valueRaw ?? '—'}
                {unit && <span className={s['DrinkingWaterCard__Unit']}> {unit}</span>}
            </p>
            {pct !== null && (
                <>
                    <div className={s['DrinkingWaterCard__BarTrack']}>
                        <div
                            className={s['DrinkingWaterCard__BarFill']}
                            style={{ width: `${pct}%`, background: barColor(pct) }}
                        />
                    </div>
                    <p className={s['DrinkingWaterCard__PctLabel']}>{Math.round(pct)}% av gränsvärdet</p>
                </>
            )}
            <p className={s['DrinkingWaterCard__Limit']}>
                {hasNoLimit
                    ? 'Inget gränsvärde'
                    : limitNumeric
                        ? `Gränsvärde: ${limitRaw} ${unit}`
                        : limitRaw || '—'}
            </p>
        </div>
    )
}
