export const dynamic = 'force-static'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH

export default function manifest() {
    return {
        name: 'Stig — Stockholms miljödata',
        short_name: 'Stig',
        description: 'Öppen data om luft, vatten och energi i Stockholm',
        lang: 'sv',
        start_url: `${basePath}/`,
        display: 'browser',
        background_color: '#faf7f4',
        theme_color: '#e17426',
        icons: [{ src: `${basePath}/favicon.ico`, sizes: 'any', type: 'image/x-icon' }],
    }
}
