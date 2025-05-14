/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", 'picsum.photos'],
  },
  rewrites() {
    return {
      beforeFiles: [
        // if the host is `app.acme.com`,
        // this rewrite will be applied
        {
          source: "/:path*",
          has: [
            {
              type: "host",
              value: "teacher1.localhost:3000",
            },
          ],
          destination: "/teacher1/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
