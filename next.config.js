/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  // 添加 OpenStreetMap 到 allowed domains
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ]
  }
}

module.exports = nextConfig 