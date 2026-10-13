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
  "public/icon.svg",
  "public/shop-collect-icon-192.png",
  "public/shop-collect-icon-512.png",
  "public/apple-touch-icon.png",
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
  if (!manifest.icons?.some((icon) => icon.src === "/icon.svg" && icon.purpose === "any")) failures.push("manifest: standard app icon missing");
  if (!manifest.icons?.some((icon) => icon.src === "/shop-collect-icon-192.png" && icon.sizes === "192x192")) failures.push("manifest: 192px raster app icon missing");
  if (!manifest.icons?.some((icon) => icon.src === "/shop-collect-icon-512.png" && icon.sizes === "512x512" && icon.purpose === "any")) failures.push("manifest: 512px raster app icon missing");
  if (!manifest.icons?.some((icon) => icon.src === "/shop-collect-icon-512.png" && icon.purpose === "maskable")) failures.push("manifest: maskable app icon missing");
  if (!manifest.icons?.some((icon) => icon.src === "/icon.svg" && icon.purpose === "any")) failures.push("manifest: vector app icon missing");
  if (!read("public/icon.svg").includes("#1f5b43")) failures.push("public/icon.svg: expected Shop & Collect brand artwork missing");
  for (const legacy of ["public/plug-icon.svg", "public/plug-icon-192.png", "public/plug-icon-512.png"]) {
    if (fs.existsSync(path.join(root, legacy))) failures.push(legacy + ": inherited The Plug icon must be removed");
  }
  const sw = read("public/sw.js");
  if (!sw.includes("shop-collect-shell-v1")) failures.push("service worker: missing isolated Shop & Collect cache namespace");
  if (!sw.includes("/sefalana-shop-collect-icon.svg")) failures.push("service worker: canonical app icon missing");
  const installCss = (read("src/app/globals.css").split("/* Branded install invitation")[1] || "").split("/*")[0];
  if (!installCss) failures.push("globals.css: Shop & Collect install styling section missing");
  if (installCss.includes("The Plug") || installCss.includes("plugInstall")) failures.push("globals.css: inherited identity remains in the active install styling section");
  if (!read("src/app/layout.tsx").includes('apple:"/apple-touch-icon.png"')) failures.push("layout: Apple touch icon is not configured");
  for (const file of ["src/app/layout.tsx", "src/app/page.tsx", "src/app/admin/page.tsx", "src/app/offline/page.tsx", "src/app/pwa-register.tsx", "src/app/pwa.css", "public/sw.js", "public/icon.svg", "public/manifest.webmanifest"]) {
    const content = read(file);
    if (content.includes("The Plug") || content.includes("plug-icon.svg")) failures.push(file + ": inherited storefront identity remains");
  }
}
if (failures.length) {
  console.error("IDENTITY VERIFICATION FAILED");
  for (const failure of failures) console.error(" - " + failure);
  process.exit(1);
}
console.log("IDENTITY VERIFIED — Shop & Collect metadata, icon, and cache namespace are configured.");
