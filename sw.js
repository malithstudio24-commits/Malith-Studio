const CACHE_NAME = 'malith-studio-cache-v3'; // Cache version එක වෙනස් කළා
// වෙබ් අඩවිය offline වැඩ කිරීමට අවශ්‍ය සියලුම files
const urlsToCache = [
  '/Malith-Studio/',
  '/Malith-Studio/index.html',
  'voicetype.html',
  'imagetotext.html',
  'textsummarizer.html',
  'todolist.html',
  'qrcodegenerator.html',
  'passwordgenerator.html',
  'presentationideagenerator.html',
  'fontconverter.html',
  'socialpostgenerator.html',
  'blog.html',
  'privacy.html',
  'logo.jpg',
  // PWA Icons
  'logo-192.png',
  'logo-512.png',
  // Tool Images
  'tool-voicetype.jpg',
  'tool-imagetotext.jpg',
  'tool-textsummarizer.jpg',
  'tool-todolist.jpg',
  'tool-qrcodegenerator.jpg',
  'tool-passwordgenerator.jpg',
  'tool-presentationideagenerator.jpg',
  'tool-fontconverter.jpg',
  'tool-socialpostgenerator.jpg',
  // Theme Images
  'theme1.jpg',
  'theme2.jpg',
  'theme3.jpg',
  // External files
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
];

// Service worker එක install කරන විට cache එක සාදයි
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // එක file එකක් හරි load වුනේ නැත්නම් install එක fail වෙන නිසා, addAll වෙනුවට forEach පාවිච්චි කරනවා
        urlsToCache.forEach(url => {
            cache.add(url).catch(err => console.warn(`Failed to cache: ${url}`, err));
        });
      })
  );
  self.skipWaiting();
});

// Request එකක් එන විට cache එකෙන් දෙනවාද නැත්නම් network එකෙන් දෙනවාද යන්න තීරණය කරයි
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache එකේ ඇත්නම්, cache එකෙන් response එක ලබා දෙයි
        if (response) {
          return response;
        }
        // Cache එකේ නැත්නම්, network එකෙන් request කර ලබා දෙයි
        return fetch(event.request);
      }
    )
  );
});

// පරණ cache files ඉවත් කරයි
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

