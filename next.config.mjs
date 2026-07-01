import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
    sassOptions: {
        includePaths: [join(__dirname, 'src')],
    },
}

export default nextConfig
