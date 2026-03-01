const CACHE_NAME = 'fitvibe-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/vite.svg',
    '/manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // Use addAll with error handling to prevent install failure if an asset is missing
                return Promise.allSettled(
                    urlsToCache.map(url => cache.add(url))
                );
            })
    );
});

self.addEventListener('fetch', event => {
    // Only intercept GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request).catch(() => {
                    // If both fail (offline and not cached), we could return a fallback here
                    return null;
                });
            })
    );
});
