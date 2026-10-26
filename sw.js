const CACHE_NAME = 'pena-kanza-v1';
const DYNAMIC_CACHE = 'pena-kanza-dynamic-v1';
const QURAN_CACHE = 'quran-images-v3'; // Cache khusus untuk gambar Qur'an

const ASSETS_TO_CACHE = [
  './',
  './icon.png',
  './img/gus muh.jpg',
  './index.html',
  './alquran.html',
  './baca_quran.html',
  './curhat.html',
  './daftar_pdf.html',
  './daftar_rumusan_by_kategori.html',
  './detail_rumusan.html',
  './kategori.html',
  './kitab_digital.html',
  './lain_lain.html',
  './pencarian.html',
  './sholawat.html',
  './tambah_data.html',
  './catur.html',
  './tambah_rumusan.html',
  './tambah_sholawat.html',
  './styles.css',
  './alquran.css',
  './curhat.css',
  './kitab_digital.css',
  './lain_lain.css',
  './sholawat.css',
  './tambah_data.css',
  './catur.css',
  './tambah_rumusan.css',
  './tambah_sholawat.css',
  './script.js',
  './alquran.js',
  './baca_quran.js',
  './curhat.js',
  './kitab_digital.js',
  './lain_lain.js',
  './sholawat.js',
  './tambah_data.js',
  './catur.js',
  './ai-worker.js',
  './tambah_rumusan.js',
  './tambah_sholawat.js',
  './rumusan_data.json',
  './data_sholawat.json',
  './kitab_bajuri.json',
  './kitab_sharqawi.json',
  './lain_lain.json',
  new Request('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css', { mode: 'no-cors' }),
  new Request('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap', { mode: 'no-cors' })
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        ASSETS_TO_CACHE.map(url => 
          cache.add(url).catch(err => console.error(`Gagal menyimpan cache: ${url}`, err))
        )
      );
    })
  );
  self.skipWaiting();
});

// Aktivasi & Hapus Cache Lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== DYNAMIC_CACHE && key !== QURAN_CACHE) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Handling
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) return;
  if (event.request.url.includes('supabase.co')) return;

  const requestUrl = event.request.url;

  // 1. STRATEGI GAMBAR QUR'AN GITHUB (Cache First: Hemat Kuota & Bisa Offline)
  if (requestUrl.includes('releases/download/v1.0/')) {
    event.respondWith(
      caches.open(QURAN_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse && (networkResponse.status === 200 || networkResponse.status === 0 || networkResponse.type === 'opaque')) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // 2. STRATEGI KODE APLIKASI & JSON (Network First: Kodingan Baru Langsung Ter-update)
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Jika online & sukses, simpan versi terbaru ke cache
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // JIKA OFFLINE: Ambil dari cache lokal agar tidak error
        return caches.match(event.request, { ignoreSearch: true });
      })
  );
});
