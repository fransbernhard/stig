import { readFile } from 'fs/promises'
import { join } from 'path'
import EnergyDashboard from '@/components/EnergyDashboard'
import styles from './page.module.css'

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
    <main className={styles.main}>
      <header className={styles.header}>
        <a href="/" className={styles.back}>← Air quality</a>
        <h1 className={styles.title}>Build energy</h1>
      </header>
      {data
        ? <EnergyDashboard data={data} />
        : <p className={styles.empty}>No energy data yet — push to trigger the workflow.</p>
      }
    </main>
  )
}
