// Offline support: serve the app from cache, refreshing the cache in the background
// whenever the network is available, so updates show up on the next open.
const CACHE = 'deadline-planner-v1';
const FILES = ['plan.html', 'manifest.webmanifest', 'icon.svg', 'icon-180.png', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        caches.open(CACHE).then(async (cache) => {
            const cached = await cache.match(e.request, { ignoreSearch: true });
            const network = fetch(e.request)
                .then(res => { if (res.ok) cache.put(e.request, res.clone()); return res; })
                .catch(() => cached);
            return cached || network;
        })
    );
});

// Tapping an alert brings the planner to the front.
self.addEventListener('notificationclick', (e) => {
    e.notification.close();
    e.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
            const open = list.find(c => c.url.includes('plan.html'));
            return open ? open.focus() : self.clients.openWindow('plan.html');
        })
    );
});
