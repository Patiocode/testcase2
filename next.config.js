/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Better for AWS deployment
  trailingSlash: true,
}

module.exports = nextConfig