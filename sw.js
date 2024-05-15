// service-worker.js

// Namnge din cache
var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    '/',
    '/index.html',
    '/history.html',
    '/style/style.css',
    '/scripts/script.mjs',
    '/style/history.css',
    '/scripts/history.js'
];

// Installera Service Worker och cacha alla nödvändiga filer
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Hämta begäranden och svara med cachade resurser eller nätverksresurser
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request).then(
                    function (response) {
                        // Kontrollera om vi fick ett giltigt svar
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Klona svaret
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

// Uppdatera cachen och ta bort gamla filer
self.addEventListener('activate', function (event) {
    var cacheWhitelist = ['my-site-cache-v1'];

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
