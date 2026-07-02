import { readFile } from 'fs/promises'
import { join } from 'path'
import WaterList from '@/components/WaterList'
import s from './WaterPage.module.scss'

async function getWaterData() {
    try {
        const raw = await readFile(join(process.cwd(), 'water.json'), 'utf8')
        return JSON.parse(raw)
    } catch {
        return null
    }
}

export const revalidate = 86400

export default async function WaterPage() {
    const data = await getWaterData()
    const sites = data?.sites ?? []
    const fetchedAt = data?.fetchedAt
        ? new Date(data.fetchedAt).toLocaleDateString('sv-SE')
        : null

    return (
        <main className={s.WaterPage}>
            <header className={s['WaterPage__Header']}>
                <h1 className={s['WaterPage__Title']}>Badplatser i Stockholms län</h1>
                <p className={s['WaterPage__Subtitle']}>
                    Avrådan rapporteras av kommunerna till Havs- och vattenmyndigheten.
                    Datan hämtas automatiskt varje natt kl. 00:00
                    {fetchedAt && <> — senast uppdaterad <strong>{fetchedAt}</strong></>}.
                </p>
            </header>

            {sites.length === 0 ? (
                <p className={s['WaterPage__Empty']}>
                    Ingen data tillgänglig — kör workflow manuellt i GitHub Actions för att hämta första gången.
                </p>
            ) : (
                <WaterList sites={sites} />
            )}

            <footer className={s['WaterPage__Footer']}>
                Data:{' '}
                <a href="https://www.havochvatten.se" target="_blank" rel="noopener">
                    Havs- och vattenmyndigheten
                </a>
                {sites.length > 0 && <> · {sites.length} badplatser</>}
            </footer>
        </main>
    )
}
