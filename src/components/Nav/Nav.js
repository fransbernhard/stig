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

export default function Nav() {
    const pathname = usePathname()

    return (
        <nav className={s.Nav}>
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
    )
}
