import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com", "media.rawg.io"],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
