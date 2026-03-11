const CACHE_NAME = 'fitvibe-v3'; // Version 3 Force Update
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/vite.svg',
    '/manifest.json'
];

// 1. Install Event: Cache Shell Assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// 2. Activate Event: Cleanup Old Caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
});

// 3. Fetch Event: Intelligent Offline Strategy
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // STRATEGY: Network-First for HTML (prevents the "Blank Page" bug)
    if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // STRATEGY: Stale-While-Revalidate for CSS/JS/Images
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            const fetchedResponse = fetch(event.request).then(networkResponse => {
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone()));
                return networkResponse;
            }).catch(() => null);

            return cachedResponse || fetchedResponse;
        })
    );
});
