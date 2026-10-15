import Link from 'next/link'
import s from './NotFoundPage.module.scss'

export const metadata = {
    title: 'Sidan finns inte',
    alternates: { canonical: null },
}

const LINKS = [
    { href: '/air', label: 'Luft' },
    { href: '/water', label: 'Badvatten' },
    { href: '/drinking-water', label: 'Dricksvatten' },
    { href: '/energy', label: 'Byggenergi' },
]

export default function NotFound() {
    return (
        <main className={s.NotFoundPage}>
            <p className={s['NotFoundPage__Code']}>404</p>
            <h1 className={s['NotFoundPage__Title']}>Sidan finns inte</h1>
            <p className={s['NotFoundPage__Text']}>
                Adressen kan vara felstavad, eller så har sidan flyttats. Prova någon av de här i stället:
            </p>
            <ul className={s['NotFoundPage__Links']}>
                {LINKS.map(({ href, label }) => (
                    <li key={href}>
                        <Link href={href} className={s['NotFoundPage__Link']}>
                            {label} →
                        </Link>
                    </li>
                ))}
            </ul>
            <Link href="/" className={s['NotFoundPage__Home']}>
                Till startsidan
            </Link>
        </main>
    )
}
