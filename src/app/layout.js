import './globals.scss'
import Nav from '@/components/Nav'

export const metadata = {
    title: 'Stig — Stockholms miljödata',
    description: 'Öppen data om luft, vatten och energi i Stockholm',
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
