import './globals.css'

export const metadata = {
    title: 'Stockholms luft',
    description: 'Realtid luftkvalitet i Stockholm',
}

export default function RootLayout({ children }) {
    return (
        <html lang="sv">
            <body>{children}</body>
        </html>
    )
}
