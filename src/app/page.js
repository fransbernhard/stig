import Link from 'next/link'
import s from './HomePage.module.scss'

const SECTIONS = [
    {
        href: '/air',
        title: 'Luftkvalitet',
        tag: 'Realtid',
        description: 'Aktuella halter av PM2.5, ozon, kvävedioxid och CO. Uppdateras automatiskt var 30:e minut.',
        accent: '#818cf8',
    },
    {
        href: '/water',
        title: 'Badvatten',
        tag: 'Säsong',
        description: '252 badplatser i Stockholms län. Avrådan och vattenstatus från Havs- och vattenmyndigheten.',
        accent: '#38bdf8',
    },
    {
        href: '/drinking-water',
        title: 'Dricksvatten',
        tag: 'Årsdata',
        description: 'Årsmedelvärden för 12 parametrar från Lovö och Norsborgs vattenverk — södra och nordvästra Stockholm.',
        accent: '#4ade80',
    },
    {
        href: '/energy',
        title: 'Energianvändning',
        tag: 'Per deploy',
        description: 'Energiåtgång och CO₂-utsläpp från CI/CD-körningar. Mäts via eco-ci vid varje bygge.',
        accent: '#fbbf24',
    },
]

export default function HomePage() {
    return (
        <main className={s.HomePage}>
            <div className={s['HomePage__Hero']}>
                <div className={s['HomePage__HeroInner']}>
                    <p className={s['HomePage__Eyebrow']}>STIG</p>
                    <h1 className={s['HomePage__Title']}>
                        Stockholm<br />
                        <span className={s['HomePage__TitleAccent']}>Miljödata</span>
                    </h1>
                    <p className={s['HomePage__Subtitle']}>
                        Öppen data om luft, vatten och energi i Stockholm — samlat på ett ställe.
                    </p>
                </div>
            </div>

            <div className={s['HomePage__Body']}>
                <div className={s['HomePage__Grid']}>
                    {SECTIONS.map((section) => (
                        <Link
                            key={section.href}
                            href={section.href}
                            className={s['HomePage__Card']}
                            style={{ '--card-accent': section.accent }}
                        >
                            <div className={s['HomePage__CardMeta']}>
                                <span className={s['HomePage__Tag']}>{section.tag}</span>
                                <span className={s['HomePage__Arrow']} aria-hidden="true">→</span>
                            </div>
                            <h2 className={s['HomePage__CardTitle']}>{section.title}</h2>
                            <p className={s['HomePage__CardDesc']}>{section.description}</p>
                        </Link>
                    ))}
                </div>

                <footer className={s['HomePage__Footer']}>
                    Data från SMHI, Havs- och vattenmyndigheten, Stockholm Vatten och Avfall samt eco-ci
                </footer>
            </div>
        </main>
    )
}
