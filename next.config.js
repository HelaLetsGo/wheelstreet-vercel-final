/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [], // Jei naudojami išoriniai paveikslėliai, įrašyk čia domenus pvz.: ["example.com"]
  },
};

module.exports = nextConfig;
