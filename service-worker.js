const CACHE_NAME = 'rb-hybrid-v5-video-cache'; // バージョンを上げてキャッシュを強制更新させる
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './verstappen.avif',  // .png から .avif に修正
  './test.mp4'          // .f1.mp4 から test.mp4 に修正
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching App Shell & Video');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

/* --- ここから下は変更なしだが、念のため記載 --- */
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('firestore.googleapis.com') || 
      event.request.url.includes('googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          // 古いバージョンのキャッシュ（v4以前）を削除してゴミ掃除
          return caches.delete(key);
        }
      }));
    })
  );
});
