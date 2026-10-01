import { spawnSync } from "node:child_process";
const env = {
  ...process.env,
  GITHUB_PAGES: "false",
  NEXT_PUBLIC_SITE_URL: "https://rl-day.pages.dev",
};
for (const [command, args] of [
  ["npm", ["run", "build"]],
  [
    "npx",
    [
      "wrangler",
      "pages",
      "deploy",
      "out",
      "--project-name",
      "rl-day",
      "--branch",
      "main",
    ],
  ],
]) {
  const result = spawnSync(command, args, { env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
