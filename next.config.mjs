/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '/appquiz',
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.bomcondutor.pt',
            },
            {
                protocol: 'https',
                hostname: 'bomcondutor.pt',
            },
        ],
    },
};

export default nextConfig;
