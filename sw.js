// Service Worker - Offline Support + Caching
var CACHE_NAME = 'village-dir-v1';
var ASSETS = [
    '/',
    '/index.html',
    '/app.js',
    '/styles.css',
    '/manifest.json',
    '/sw.js'
];

// Install event
self.addEventListener('install', function(event) {
    console.log('SW: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('SW: Caching assets');
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', function(event) {
    console.log('SW: Activating...');
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(function(key) {
                    return key !== CACHE_NAME;
                }).map(function(key) {
                    console.log('SW: Deleting old cache:', key);
                    return caches.delete(key);
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', function(event) {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;
    
    // Skip Supabase API calls - let them go through
    if (event.request.url.indexOf('supabase.co') !== -1) {
        event.respondWith(
            fetch(event.request).catch(function() {
                return new Response(JSON.stringify({ error: 'Offline' }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );
        return;
    }
    
    // For static assets - Network first
    event.respondWith(
        fetch(event.request)
        .then(function(response) {
            // Clone response for caching
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
                cache.put(event.request, clone);
            });
            return response;
        })
        .catch(function() {
            // Fallback to cache
            return caches.match(event.request).then(function(response) {
                return response || caches.match('/index.html');
            });
        })
    );
});