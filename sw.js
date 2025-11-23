const CACHE_NAME = "prompt-oracle-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./prompts.json",
  "./manifest.json",
  "./cards/back.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// ---- INSTALL ----
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // ★ 关键：立即启用新 SW
});

// ---- ACTIVATE ----
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim()); // ★ 关键：立即接管控制权
});

// ---- FETCH ----
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Always try cache first, fallback to network
      return (
        cached ||
        fetch(event.request).catch(() =>
          // 避免 fetch sw.js 报错导致再次崩
          cached
        )
      );
    })
  );
});
