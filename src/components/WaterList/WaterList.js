'use client'

import { useState } from 'react'
import WaterCard from '@/components/WaterCard'
import s from './WaterList.module.scss'

export default function WaterList({ sites }) {
    const [query, setQuery] = useState('')

    const filtered = query.trim()
        ? sites.filter((site) =>
              site.bathingWater.name.toLowerCase().includes(query.toLowerCase())
          )
        : sites

    const advisoryCount = filtered.filter((site) => site.adviceAgainstBathing?.length > 0).length

    return (
        <div className={s.WaterList}>
            <div className={s['WaterList__SearchRow']}>
                <input
                    className={s['WaterList__Search']}
                    type="search"
                    placeholder="Sök badplats…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoComplete="off"
                />
                <p className={s['WaterList__Meta']}>
                    {filtered.length} platser
                    {advisoryCount > 0 && (
                        <span className={s['WaterList__AdvisoryBadge']}> · {advisoryCount} avrådan</span>
                    )}
                </p>
            </div>

            {filtered.length === 0 ? (
                <p className={s['WaterList__Empty']}>Ingen badplats matchar sökningen.</p>
            ) : (
                <ul className={s['WaterList__List']}>
                    {filtered.map((site) => (
                        <WaterCard key={site.bathingWater.id} {...site} />
                    ))}
                </ul>
            )}
        </div>
    )
}
