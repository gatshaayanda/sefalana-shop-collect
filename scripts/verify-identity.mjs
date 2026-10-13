import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/app/admin/page.tsx",
  "src/app/offline/page.tsx",
  "src/app/pwa-register.tsx",
  "public/sw.js",
  "public/manifest.webmanifest",
  "public/sefalana-shop-collect-icon.svg",
  "package.json",
];
const failures = [];
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) failures.push(file + ": missing required identity file");
}
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
if (!failures.length) {
  const pkg = JSON.parse(read("package.json"));
  const manifest = JSON.parse(read("public/manifest.webmanifest"));
  if (pkg.name !== "sefalana-shop-collect") failures.push("package.json: incorrect package name");
  if (manifest.name !== "Shop & Collect | Grocery Shopping") failures.push("manifest: incorrect app name");
  if (manifest.short_name !== "Shop & Collect") failures.push("manifest: incorrect short name");
  if (manifest.theme_color !== "#1f5b43") failures.push("manifest: incorrect theme color");
  if (!manifest.icons?.some((icon) => icon.src === "/sefalana-shop-collect-icon.svg")) failures.push("manifest: app icon missing");
  const sw = read("public/sw.js");
  if (!/shop-collect-shell-v\\d+/.test(sw)) failures.push("service worker: missing isolated Shop & Collect cache namespace");
  if (!sw.includes("/sefalana-shop-collect-icon.svg")) failures.push("service worker: canonical app icon missing");
  for (const file of ["src/app/layout.tsx", "src/app/page.tsx", "src/app/admin/page.tsx", "src/app/offline/page.tsx", "src/app/pwa-register.tsx", "public/sw.js"]) {
    if (/The Plug|plug-icon\\.svg/i.test(read(file))) failures.push(file + ": inherited storefront identity remains");
  }
}
if (failures.length) {
  console.error("IDENTITY VERIFICATION FAILED");
  for (const failure of failures) console.error(" - " + failure);
  process.exit(1);
}
console.log("IDENTITY VERIFIED — Shop & Collect metadata, icon, and cache namespace are configured.");
