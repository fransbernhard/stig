import './globals.scss'
import Nav from '@/components/Nav'
import { SITE_URL } from '@/lib/site'

const description = 'Öppen data om luft, vatten och energi i Stockholm'

export const metadata = {
    title: { default: 'Stig — Stockholms miljödata', template: '%s — Stig' },
    description,
    alternates: { canonical: `${SITE_URL}/` },
    openGraph: {
        type: 'website',
        locale: 'sv_SE',
        siteName: 'Stig',
        title: 'Stig — Stockholms miljödata',
        description,
        url: `${SITE_URL}/`,
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="sv">
            <body>
                <Nav />
                {children}
            </body>
        </html>
    )
}
