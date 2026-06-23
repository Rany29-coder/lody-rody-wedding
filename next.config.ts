import type { NextConfig } from "next";

// When building for GitHub Pages (project site), the app is served from
// /lody-rody-wedding, so assets need a basePath. Local dev stays at root.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repo = "lody-rody-wedding";

const nextConfig: NextConfig = {
  output: "export", // static export — works on GitHub Pages, Supabase calls run client-side
  basePath: isGithubPages ? `/${repo}` : "",
  assetPrefix: isGithubPages ? `/${repo}/` : "",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
