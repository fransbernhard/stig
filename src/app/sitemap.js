import { SITE_URL, PAGES } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap() {
    return [{ url: `${SITE_URL}/` }, ...PAGES.map(({ path }) => ({ url: `${SITE_URL}${path}` }))]
}
