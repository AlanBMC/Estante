const CACHE_NAME = 'estante';
const urlsToCache = [
    '/estante', // Rota principal
    '/static/css/global.css', // CSS
    '/static/icons/maskable_icon_x192.png', // Ícone
    '/static/templates/estante.html', // Template
];

// Instala e armazena no cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache aberto');
                return cache.addAll(urlsToCache)
                    .catch((err) => {
                        console.error('Erro ao adicionar ao cache:', err);
                    });
            })
    );
});

// Intercepta requisições
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
