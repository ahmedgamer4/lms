/** @type {import('next').NextConfig} */
const nextConfig = {
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
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
