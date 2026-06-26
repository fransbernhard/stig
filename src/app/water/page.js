'use client'

import { useEffect, useState } from 'react'
import { fetchStockholmWaterQuality } from '@/lib/water-quality'
import WaterList from '@/components/WaterList'
import s from './page.module.scss'

export default function WaterPage() {
    const [sites, setSites] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchStockholmWaterQuality()
            .then(setSites)
            .catch((e) => setError(e.message))
    }, [])

    return (
        <main className={s.WaterPage}>
            <header className={s['WaterPage__Header']}>
                <h1 className={s['WaterPage__Title']}>Badplatser i Stockholm</h1>
            </header>

            {error ? (
                <p className={s['WaterPage__Empty']}>Kunde inte ladda badvattensdata. Prova igen senare.</p>
            ) : sites === null ? (
                <p className={s['WaterPage__Empty']}>Laddar…</p>
            ) : sites.length === 0 ? (
                <p className={s['WaterPage__Empty']}>Ingen data tillgänglig för tillfället.</p>
            ) : (
                <WaterList sites={sites} />
            )}

            <footer className={s['WaterPage__Footer']}>
                Data:{' '}
                <a href="https://www.havochvatten.se" target="_blank" rel="noopener">
                    Havs- och vattenmyndigheten
                </a>
                {sites?.length > 0 && (
                    <> · {sites.length} badplatser</>
                )}
            </footer>
        </main>
    )
}
