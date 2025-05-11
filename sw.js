const CACHE_NAME = 'malama-mana-cache-v1';
const urlsToCache = ['./','./index.html','./style.css','./app.js','./manifest.json'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache)));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(resp => resp || fetch(e.request)));
});