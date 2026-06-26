import './globals.scss'
import Nav from '@/components/Nav'

export const metadata = {
    title: 'Stockholms luft',
    description: 'Realtid luftkvalitet i Stockholm',
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
