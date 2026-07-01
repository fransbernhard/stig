'use client'

import { useEffect, useState } from 'react'
import { co2 } from '@tgwf/co2'
import s from './CarbonBadge.module.scss'

const estimator = new co2()

export default function CarbonBadge() {
    const [mg, setMg] = useState(null)

    useEffect(() => {
        const measure = () => {
            const entries = [
                ...performance.getEntriesByType('resource'),
                ...performance.getEntriesByType('navigation'),
            ]
            const bytes = entries.reduce((sum, e) => sum + (e.transferSize || 0), 0)
            if (bytes > 0) {
                setMg(Math.round(estimator.perVisit(bytes, false) * 1000))
            }
        }

        if (document.readyState === 'complete') {
            measure()
        } else {
            window.addEventListener('load', measure)
            return () => window.removeEventListener('load', measure)
        }
    }, [])

    if (mg === null) return null

    return (
        <span
            className={s.CarbonBadge}
            title="Uppskattad CO₂-utsläpp per sidvisning enligt Sustainable Web Design-modellen"
        >
            ~{mg} mg CO₂/besök
        </span>
    )
}
