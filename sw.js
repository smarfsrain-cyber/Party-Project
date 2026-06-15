// Event Party Service Worker v3
// Network-first: luôn lấy file mới nhất, không cache HTML

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  // Xóa toàn bộ cache cũ
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Luôn network-first, không cache gì cả
  // Chỉ để PWA install hoạt động, không ảnh hưởng loading
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
