import { readFile } from 'fs/promises'
import { join } from 'path'
import EnergyDashboard from '@/components/EnergyDashboard'
import s from './page.module.scss'

async function getEnergyData() {
    try {
        const raw = await readFile(join(process.cwd(), 'energy.json'), 'utf8')
        return JSON.parse(raw)
    } catch {
        return null
    }
}

export default async function EnergyPage() {
    const data = await getEnergyData()

    return (
        <main className={s.EnergyPage}>
            <header className={s['EnergyPage__Header']}>
                <h1 className={s['EnergyPage__Title']}>Build energy</h1>
            </header>
            {data ? (
                <EnergyDashboard data={data} />
            ) : (
                <p className={s['EnergyPage__Empty']}>No energy data yet — push to trigger the workflow.</p>
            )}
        </main>
    )
}
