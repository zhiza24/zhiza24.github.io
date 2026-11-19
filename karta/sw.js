/* Карта истинных желаний — офлайн после первого открытия */
const CACHE = "karta-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./app.js",
  "./style.css",
  "./manifest.webmanifest",
  "./img/icon-192.svg",
  "./img/icon-512.svg",
  "./img/splash.svg",
  "./img/launch-btn.svg",
  "./img/season-spring.svg",
  "./img/season-summer.svg",
  "./img/season-autumn.svg",
  "./img/season-winter.svg",
  "./img/map-bg.svg"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  e.respondWith(
    caches.match(req).then(cached => {
      const net = fetch(req).then(res => {
        if (res && res.ok && (req.url.startsWith(self.location.origin))) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => cached || caches.match("./index.html"));
      return cached || net;
    })
  );
});
