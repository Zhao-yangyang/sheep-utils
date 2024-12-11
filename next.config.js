/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['*'], // 或者指定具体的域名
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