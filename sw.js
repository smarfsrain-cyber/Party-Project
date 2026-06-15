const CACHE = 'event-party-v1';
const ASSETS = [
  '/Party-Project/',
  '/Party-Project/index.html',
  '/Party-Project/rsvp.html',
  '/Party-Project/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  // Network first cho Supabase, cache first cho assets
  if(e.request.url.includes('supabase.co')){
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
  } else {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }))
    );
  }
});
