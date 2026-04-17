const CACHE = 'workout-guide-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Cache-first for external assets (GIFs, fonts) — these rarely change
  if (url.includes('gymvisual.com') || url.includes('fonts.')) {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached;
          return fetch(e.request).then(resp => {
            if (resp && resp.status === 200) cache.put(e.request, resp.clone());
            return resp;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  // Network-first for the HTML page itself, fallback to cache
  e.respondWith(
    fetch(e.request).then(resp => {
      if (resp && resp.status === 200) {
        caches.open(CACHE).then(c => c.put(e.request, resp.clone()));
      }
      return resp;
    }).catch(() => caches.match(e.request))
  );
});
