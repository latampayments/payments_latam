/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    images: {
      remotePatterns: [
        {
            protocol: 'https',
            hostname: 'thumbs2.imgbox.com',
            port: '',
            pathname: '/**',
        },
        {
            protocol: 'https',
            hostname: 'logopng.com.br',
            port: '',
            pathname: '/**',
        },
        {
            protocol: 'https',
            hostname: 'mir-s3-cdn-cf.behance.net',
            port: '',
            pathname: '/**',
        },
        {
            protocol: 'https',
            hostname: 'logotypes101.com',
            port: '',
            pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'logospng.org',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'www.logotypes101.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 's2-techtudo.glbimg.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'cms.santander.com.br',
          port: '',
          pathname: '/**',
      },
      ],
    },
  }
//module.exports = nextConfig
