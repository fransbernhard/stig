'use client'

import { useState } from 'react'
import s from './WaterList.module.scss'

// Filters the server-rendered cards by toggling `hidden`, so the site data isn't sent twice
export default function WaterSearch({ listId, total, advisoryCount }) {
    const [query, setQuery] = useState('')
    const [counts, setCounts] = useState({ visible: total, advisories: advisoryCount })

    const onChange = (e) => {
        const value = e.target.value
        const q = value.trim().toLowerCase()
        let visible = 0
        let advisories = 0

        document.querySelectorAll(`#${listId} > li`).forEach((li) => {
            const match = !q || li.dataset.search.includes(q)
            li.hidden = !match
            if (match) {
                visible++
                if (li.dataset.advisory) advisories++
            }
        })

        setQuery(value)
        setCounts({ visible, advisories })
    }

    return (
        <>
            <div className={s['WaterList__SearchRow']}>
                <input
                    className={s['WaterList__Search']}
                    type="search"
                    placeholder="Sök badplats…"
                    value={query}
                    onChange={onChange}
                    autoComplete="off"
                />
                <p className={s['WaterList__Meta']}>
                    {counts.visible} platser
                    {counts.advisories > 0 && (
                        <span className={s['WaterList__AdvisoryBadge']}> · {counts.advisories} avrådan</span>
                    )}
                </p>
            </div>

            {counts.visible === 0 && <p className={s['WaterList__Empty']}>Ingen badplats matchar sökningen.</p>}
        </>
    )
}
