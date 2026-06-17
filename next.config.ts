import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

import path from "path";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  sassOptions: {
    silenceDeprecations: ["import"],
    loadPaths: [path.join(process.cwd(), "src")],
  },
};

export default withNextIntl(nextConfig);
