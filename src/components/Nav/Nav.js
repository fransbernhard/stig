'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import s from './Nav.module.scss'

const LINKS = [
    { href: '/air', label: 'Luft' },
    { href: '/water', label: 'Badvatten' },
    { href: '/drinking-water', label: 'Dricksvatten' },
    { href: '/energy', label: 'Energi' },
]

function Logo() {
    return (
        <svg height="28" viewBox="0 0 90 30" fill="none" aria-hidden="true" style={{width:'auto'}}>
            {/* outer edge flames — faint */}
            <path d="M8 30 C6 26 5 22 8 19 C11 22 12 26 10 30Z" fill="currentColor" opacity="0.35"/>
            <path d="M82 30 C80 25 79 21 82 18 C85 21 86 25 84 30Z" fill="currentColor" opacity="0.35"/>

            {/* secondary flames */}
            <path d="M18 30 C15 24 14 17 18 12 C22 17 23 24 21 30Z" fill="currentColor" opacity="0.55"/>
            <path d="M72 30 C69 23 68 16 72 11 C76 16 77 23 75 30Z" fill="currentColor" opacity="0.55"/>

            {/* mid flames */}
            <path d="M30 30 C26 22 25 12 30 6 C35 12 36 22 33 30Z" fill="currentColor" opacity="0.75"/>
            <path d="M60 30 C56 21 55 11 60 5 C65 11 66 21 63 30Z" fill="currentColor" opacity="0.75"/>

            {/* tall main flames */}
            <path d="M44 30 C40 20 38 9 44 2 C50 9 52 20 48 30Z" fill="currentColor" opacity="0.9"/>

            {/* inner glow highlights */}
            <path d="M44 30 C42 23 41 14 44 9 C47 14 48 23 46 30Z" fill="currentColor" opacity="0.35"/>
            <path d="M30 30 C28 24 28 16 30 11 C32 16 33 24 32 30Z" fill="currentColor" opacity="0.3"/>
            <path d="M60 30 C58 23 58 15 60 10 C62 15 63 23 62 30Z" fill="currentColor" opacity="0.3"/>
        </svg>
    )
}

export default function Nav() {
    const pathname = usePathname()

    return (
        <header className={s.Nav}>
            <div className={s['Nav__Container']}>
                <Link href="/" className={s['Nav__Logo']} aria-label="Hem">
                    <Logo />
                </Link>
                <nav className={s['Nav__Links']}>
                    {LINKS.map(({ href, label }) => {
                        const active = pathname === href || (href !== '/' && pathname.startsWith(href))
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`${s['Nav__Link']} ${active ? s['Nav__Link--Active'] : ''}`}
                            >
                                {label}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </header>
    )
}
