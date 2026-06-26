import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'export',
  basePath: isProd ? '/stig' : '',
  images: { unoptimized: true },
  sassOptions: {
    includePaths: [join(__dirname, 'src')],
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? '/stig' : '',
  },
}

export default nextConfig
