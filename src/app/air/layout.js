import { pageMetadata } from '@/lib/site'

// The page itself is a client component, so its metadata lives here
export const metadata = pageMetadata('/air')

export default function AirLayout({ children }) {
    return children
}
