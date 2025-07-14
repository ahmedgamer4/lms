import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  rewrites: async () => ({
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
  }),
};

export default withNextIntl(nextConfig);
