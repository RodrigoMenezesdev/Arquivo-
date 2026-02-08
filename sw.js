const CACHE_NAME = 'enf-pro-v1';
const ASSETS_TO_CACHE = [
  './',
  './404.html',
  './style.css',
  './script.js',
  './manifest.json',
  './img/icon-192.png',
  './img/icon-512.png',
  './img/ebook01.pdf'
];

// Instalação: Salva os arquivos no cache do navegador
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache iniciado: Guardando arquivos do Enfermagem Pro');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Ativação: Limpa versões antigas do app
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Busca (Fetch): Serve o conteúdo do cache se estiver offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retorna o arquivo do cache OU busca na rede se não estiver no cache
      return response || fetch(event.request).catch(() => {
        // Se a busca na rede falhar (offline) e for uma navegação, mostra o 404.html
        if (event.request.mode === 'navigate') {
          return caches.match('./404.html');
        }
      });
    })
  );
});
