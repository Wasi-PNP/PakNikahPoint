// PakNikahPoint — Service Worker v3
const CACHE_NAME = 'pnp-cache-v3';
const ASSETS = [
  '/PakNikahPoint/',
  '/PakNikahPoint/index.html',
  '/PakNikahPoint/manifest.json',
  '/PakNikahPoint/css/main.css',
  '/PakNikahPoint/js/app.js',
  '/PakNikahPoint/js/db.js',
  '/PakNikahPoint/js/dashboard.js',
  '/PakNikahPoint/js/daily.js',
  '/PakNikahPoint/pages/register.html',
  '/PakNikahPoint/pages/profiles.html',
  '/PakNikahPoint/pages/matching.html',
  '/PakNikahPoint/pages/search.html',
  '/PakNikahPoint/pages/admin.html',
  '/PakNikahPoint/pages/gallery.html',
  '/PakNikahPoint/assets/logo.svg'
];

// Install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — Network first, cache fallback
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
