/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        staleTimes: {
            dynamic: 30,
        }
    },
    serverExternalPackages: ["@node-res/argon2"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "utfs.io",
                pathname: `/a/${process.env.UPLOADTHING_APP_ID}/*`,
            }
        ]
    },
    rewrites: () => {
        return [
            {
                source: "/hashtag/:tag",
                destination: "/search?q=%23:tag"
            }
        ]
    }
};

export default nextConfig;
