import { DM_Sans } from 'next/font/google'
import './globals.scss'
import Nav from '@/components/Nav'

const sans = DM_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    variable: '--font-sans',
    display: 'swap',
})

export const metadata = {
    title: 'Stig — Stockholms miljödata',
    description: 'Öppen data om luft, vatten och energi i Stockholm',
}

export default function RootLayout({ children }) {
    return (
        <html lang="sv" className={sans.variable}>
            <body>
                <Nav />
                {children}
            </body>
        </html>
    )
}
