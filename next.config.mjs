/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    output: 'export',
    images: {
        unoptimized: true,
        domains: ['i.imgur.com'],
        remotePatterns: [
            { protocol: 'https', hostname: '**.githubusercontent.com' },
            { protocol: 'https', hostname: '**.github.com' },
            { protocol: 'https', hostname: 'turbo.build' }
        ],
    },
    experimental: {
        // Caching all page.jsx files on the client for 5 minutes.
        // Resulting in immediate navigation and no loading time.
        staleTimes: {
            dynamic: 300,
            static: 300
        }
    },
    env: {
        GH_TOKEN: process.env.GH_TOKEN,
    }
};

export default nextConfig;
