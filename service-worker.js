const CACHE_NAME = "petalping-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js"
];

// Install SW
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch requests
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
