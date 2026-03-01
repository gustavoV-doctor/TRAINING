const CACHE_NAME = 'demon-training-v1';
const ASSETS = [
    '/TRAINING/',
    '/TRAINING/index.html',
    '/TRAINING/style.css',
    '/TRAINING/app.js',
    '/TRAINING/manifest.json',
    '/TRAINING/assets/char-baki.png',
    '/TRAINING/assets/char-yujiro.png',
    '/TRAINING/assets/char-hanayama.png',
    '/TRAINING/assets/char-hero.png',
    '/TRAINING/assets/icon-192.png',
    '/TRAINING/assets/icon-512.png'
];

// Install — cache all assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch — serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cached) => {
            return cached || fetch(event.request).then((response) => {
                // Cache new requests dynamically
                if (response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clone);
                    });
                }
                return response;
            }).catch(() => {
                // Offline fallback
                if (event.request.destination === 'document') {
                    return caches.match('/TRAINING/index.html');
                }
            });
        })
    );
});
