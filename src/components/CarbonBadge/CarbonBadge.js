'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { co2 } from '@tgwf/co2'
import s from './CarbonBadge.module.scss'

const estimator = new co2()

export default function CarbonBadge() {
    const [mg, setMg] = useState(null)
    const pathname = usePathname()
    const navStartRef = useRef(0)

    useEffect(() => {
        navStartRef.current = performance.now()
        setMg(null)

        const measure = () => {
            const entries = [
                ...performance.getEntriesByType('resource'),
                ...performance.getEntriesByType('navigation'),
            ]
            const bytes = entries
                .filter((e) => e.startTime >= navStartRef.current - 50)
                .reduce((sum, e) => sum + (e.transferSize || 0), 0)
            if (bytes > 0) {
                setMg(Math.round(estimator.perVisit(bytes, false) * 1000))
            }
        }

        const timer = setTimeout(measure, 800)
        return () => clearTimeout(timer)
    }, [pathname])

    return (
        <span
            className={`${s.CarbonBadge} ${mg === null ? s['CarbonBadge--Loading'] : ''}`}
            title="Uppskattad CO₂-utsläpp per sidvisning enligt Sustainable Web Design-modellen"
        >
            {mg === null ? '~… mg CO₂' : `~${mg} mg CO₂`}
        </span>
    )
}
