import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    /**
     * Default root is this package (`chesstools/`), so `../shared` is outside the
     * Turbopack sandbox and triggers "leaves the filesystem root". Expanding root
     * to the monorepo directory keeps `shared/` inside the allowed tree.
     *
     * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory
     */
    root: path.resolve(process.cwd(), ".."),
  },
};

export default nextConfig;
