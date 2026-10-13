import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Shop & Collect | Grocery Shopping",
    short_name: "Shop & Collect",
    description: "A proposed grocery shopping and collection concept for Mogoditshane.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f6ef",
    theme_color: "#1f5b43",
    orientation: "portrait-primary",
    lang: "en",
    categories: ["shopping", "food"],
    prefer_related_applications: false,
    icons: [
      { src: "/shop-collect-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/shop-collect-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/shop-collect-icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }
    ],
    shortcuts: [
      {
        name: "Browse groceries",
        short_name: "Browse",
        description: "Explore the Shop & Collect catalogue",
        url: "/",
        icons: [{ src: "/shop-collect-icon-192.png", sizes: "192x192", type: "image/png" }]
      },
      {
        name: "My requests",
        short_name: "Requests",
        description: "View your shopping requests",
        url: "/account",
        icons: [{ src: "/shop-collect-icon-192.png", sizes: "192x192", type: "image/png" }]
      },
      {
        name: "Shop & Collect admin",
        short_name: "Admin",
        description: "Open protected business control",
        url: "/admin",
        icons: [{ src: "/shop-collect-icon-192.png", sizes: "192x192", type: "image/png" }]
      }
    ]
  };
}
