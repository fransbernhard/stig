// Full public address, used where links must be absolute (sitemap, Open Graph)
export const SITE_URL = 'https://fransbernhard.github.io/stig'

export const PAGES = [
    { path: '/air', title: 'Luft', description: 'Luftkvalitet, partiklar och pollen i centrala Stockholm just nu.' },
    { path: '/water', title: 'Badvatten', description: 'Badplatser i Stockholms län och om kommunerna avråder från bad.' },
    { path: '/drinking-water', title: 'Dricksvatten', description: 'Analysvärden för Stockholms dricksvatten jämfört med gränsvärdena.' },
    { path: '/energy', title: 'Byggenergi', description: 'Hur mycket energi det går åt att bygga och publicera sajten.' },
]

export function pageMetadata(path) {
    const { title, description } = PAGES.find((p) => p.path === path)
    return {
        title,
        description,
        alternates: { canonical: `${SITE_URL}${path}` },
        openGraph: { title: `${title} — Stig`, description, url: `${SITE_URL}${path}` },
    }
}
