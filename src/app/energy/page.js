import EnergyDashboard from '@/components/EnergyDashboard'
import s from './EnergyPage.module.scss'

export default function EnergyPage() {
    return (
        <main className={s.EnergyPage}>
            <header className={s['EnergyPage__Header']}>
                <h1 className={s['EnergyPage__Title']}>Energiåtgång per bygge</h1>
                <p className={s['EnergyPage__Subtitle']}>
                    Varje gång sajten publiceras byggs den om på en molnserver hos GitHub. Här ser du hur
                    mycket energi det senaste bygget förbrukade.
                </p>
            </header>

            <div className={s['EnergyPage__Notice']}>
                <strong>Värdena är uppskattningar.</strong>{' '}
                <a href="https://github.com/green-coding-solutions/eco-ci-energy-estimation" target="_blank" rel="noopener">
                    eco-ci
                </a>{' '}
                mäter hur hårt serverns processor belastas och räknar om det till energi utifrån en modell av
                GitHubs servrar. Siffrorna gäller bara bygget, alltså paketinstallation och kompilering – inte
                energin som går åt när någon besöker sajten. Den visas i stället i CO₂-märket i menyn.
            </div>

            <EnergyDashboard />
        </main>
    )
}
