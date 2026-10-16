// Messaging is an optional online enhancement. A CDN/config outage must not prevent
// the core service worker from installing and serving its offline shell.
try {
  importScripts("https://www.gstatic.com/firebasejs/11.9.0/firebase-app-compat.js");
  importScripts("https://www.gstatic.com/firebasejs/11.9.0/firebase-messaging-compat.js");
  importScripts("/api/firebase/messaging-sw-config");
} catch (error) {
  console.warn("Shop & Collect messaging is unavailable until the service worker updates online.", error);
}

let shopCollectMessaging = null;
try {
  const config = self.__SHOP_COLLECT_FIREBASE_CONFIG__;
  if (config && config.apiKey && config.projectId && config.messagingSenderId && config.appId) {
    firebase.initializeApp(config);
    shopCollectMessaging = firebase.messaging();
    shopCollectMessaging.onBackgroundMessage((payload) => {
      // Notification payloads are displayed automatically by Firebase. Only render
      // data-only pushes here to avoid showing the same notification twice.
      if (payload.notification) return;
      const title = payload.data?.title || "Shop & Collect update";
      const options = {
        body: payload.data?.body || "Open Shop & Collect to check your latest order information.",
        icon: "/sefalana-shop-collect-icon.svg",
        badge: "/sefalana-shop-collect-icon.svg",
        data: { link: payload.data?.link || "/" },
      };
      self.registration.showNotification(title, options);
    });
  } else {
    console.error("Shop & Collect Firebase Messaging web config is incomplete.");
  }
} catch (error) {
  console.error("Shop & Collect Firebase Messaging service worker could not initialize.", error);
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const rawLink = event.notification.data?.link || "/";
  let link = "/";
  try {
    const target = new URL(rawLink, self.location.origin);
    if (target.origin === self.location.origin) link = target.pathname + target.search + target.hash;
  } catch {
    link = "/";
  }
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
    for (const client of list) {
      if ("focus" in client) {
        void client.navigate(link);
        return client.focus();
      }
    }
    return clients.openWindow(link);
  }));
});

const CACHE_VERSION = "shop-collect-shell-v2";
const MEDIA_CACHE = "shop-collect-media-v1";
const SHELL_CACHE = CACHE_VERSION;
const STATIC_LIMIT = 100;
const PUBLIC_PAGE_LIMIT = 12;
const APP_SHELL = ["/", "/offline", "/icon.svg", "/sefalana-shop-collect-icon.svg", "/shop-collect-icon-192.png", "/shop-collect-icon-512.png", "/apple-touch-icon.png", "/manifest.webmanifest"];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    // Do not fail worker installation just because a cache write or optional request
    // failed. An online page can explicitly retry shell precaching after reconnection.
    try { await precacheShell(); }
    catch (error) { console.warn("Shop & Collect shell precache will retry when online.", error); }
    // Install the new routing/cache policy immediately; the page is not force-reloaded.
    await self.skipWaiting();
  })());
});

async function precacheShell() {
  const shell = await caches.open(SHELL_CACHE);
  const discovered = new Set();
  for (const path of APP_SHELL) {
    try {
      const request = new Request(path, { cache: "reload" });
      const response = await fetch(request);
      if (!response.ok) continue;
      await shell.put(request, response.clone());
      if (!(response.headers.get("content-type") || "").includes("text/html")) continue;
      const html = await response.text();
      for (const match of html.matchAll(/(?:src|href)=["'](\/_next\/static\/[^"']+)["']/g)) discovered.add(match[1]);
    } catch {}
  }
  await Promise.all([...discovered].map(async path => {
    try {
      const request = new Request(path, { cache: "reload" });
      const response = await fetch(request);
      if (response.ok) await shell.put(request, response);
    } catch {}
  }));
  await trimCache(SHELL_CACHE, STATIC_LIMIT);
}

self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
  if (event.data?.type === "PRECACHE_SHELL") {
    event.waitUntil(precacheShell().catch(error => {
      console.warn("Shop & Collect shell precache retry failed.", error);
    }));
  }
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => (key.startsWith("shop-collect-shell-") && key !== SHELL_CACHE) || key.startsWith("theplug-shell-") || (key.startsWith("shop-collect-media-") && key !== MEDIA_CACHE) || key.startsWith("theplug-media-")).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) return;

  const isNavigation = request.mode === "navigate" || request.headers.get("accept")?.includes("text/html");
  const isPrivate = /^\/(?:account|requests|orders|admin|invite)(?:\/|$)/.test(url.pathname);
  const isPublicShellPage = url.pathname === "/" || url.pathname === "/offline";

  // Private/member routes are network-only. Never serve a cached account/request page as
  // a substitute for a different route or when the authenticated page cannot be fetched.
  if (isNavigation && isPrivate) {
    event.respondWith(fetch(request).catch(() => caches.open(SHELL_CACHE).then(cache => cache.match("/offline")).then(response => response || Response.error())));
    return;
  }

  // The browser uses this manifest to name the native install prompt. Always refresh it
  // from the network when possible so a previous app identity cannot persist in Cache Storage.
  if (url.pathname === "/manifest.webmanifest") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (url.pathname.startsWith("/_next/static/") || /\.(?:css|js|woff2?|ttf|otf|png|jpe?g|webp|svg|ico|avif)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (isNavigation && isPublicShellPage) {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) void caches.open(SHELL_CACHE).then(async cache => {
        await cache.put(request, response.clone());
        await trimCache(SHELL_CACHE, PUBLIC_PAGE_LIMIT + STATIC_LIMIT);
      }).catch(error => console.warn("Shop & Collect page cache write failed.", error));
      return response;
    }).catch(async () => {
      const cache = await caches.open(SHELL_CACHE);
      return await cache.match(request) || await cache.match(url.pathname) || await cache.match("/") || await cache.match("/offline") || Response.error();
    }));
  }
});

async function networkFirst(request) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const response = await fetch(new Request(request, { cache: "no-store" }));
    if (response.ok) {
      await cache.put(request, response.clone());
      return response;
    }
    return (await cache.match(request)) || response;
  } catch {
    return (await cache.match(request)) || Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(SHELL_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
      await trimCache(SHELL_CACHE, STATIC_LIMIT + PUBLIC_PAGE_LIMIT);
    }
    return response;
  } catch {
    return Response.error();
  }
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  await Promise.all(keys.slice(0, keys.length - maxEntries).map(request => cache.delete(request)));
}
