// Generate App Shell

let static_cache = 'static_v1'; //Archivos estaticos (App Shell)
let dynamic_cache = 'dynamic_v1'; //
let inmutable_cache = 'inmutable_v1'; //

let files_appShell = [
    "/",
    "index.html",
    "main.js",
    "not-found.html",
    "style.css",
    "manifest.json"
];

let inmutableFiles = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css'
];




self.addEventListener('install', result => {
    //Abrir el cache con base al nombre y sino existe lo crea

    
    /*result.waitUntil(
        caches.open(inmutable_cache).then(cache => {
            cache.add('https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css');
        })
        
    );*/

    const openStatic = caches.open(static_cache).then(cache => {
        cache.addAll(files_appShell);
    });

    const openInmutable = caches.open(inmutable_cache).then(cache => {
        cache.addAll(inmutableFiles);
    });

    //Este metodo hace todas las promesas que esten dentro en una sola
    result.waitUntil(
        Promise.all([
            openStatic, 
            openInmutable
        ])
    );

})

self.addEventListener('activate', event => {
    // delete any caches that aren't in expectedCaches
    // which will get rid of static-v1
    event.waitUntil(
      caches.keys().then(keys => Promise.all(
        keys.map(key => {
          if (!static_cache.includes(key) && key.includes('static')) {
            return caches.delete(key);
          }
        })
      )).then(() => {
        console.log('V2 now ready to handle fetches!');
      })
    );
  });



//1. Abrir el inmutable
//2. agregar el la url del bootstrap



self.addEventListener('fetch', event => {
    /* 
    1.- Cache Only

    event.respondWith(
        caches.match(event.request)
    )
    */


    /*
    2.- Network Only
    La aplicacion solamente hara peticiones a internet

    event.respondWith(
        // Deezer
        fetch(event.request)
    )

    */

    // 3. Cache First
    // La pagina web, primero antes que nada, va a revisar si los recurso
    //estan dentro del cache, en caso contrario, los va a pedir en la red

    // IF,   promise  (then, catch)

    /* if (caches.match(event.request)) {
        event.respondWith(caches.match(event.request))
    } else {
        event.respondWith(fetch(event.request))
    } */


    /* event.respondWith(caches.match(event.request).then(
        cacheResponse => {
            return cacheResponse || fetch(event.request)
        }
    )) */

    // 4. Network First: Obtener los datos más actualizados desde la red
    // cuando no podemos almacenar cierta info en cache

    /* 
    v1
    event.respondWith(
        fetch(event.request).then(
        networkResponse => {
            return networkResponse || caches.match(event.request).catch(error => {
                // Error de que no se encuentra en el cache
            })
        }
    ).catch(error => {
        // Error de que no se encuentra en la red
    })) */

    //v2
    // event.respondWith(fetch(event.request).catch(error => caches.match(event.request)))

    // 5. Primero el cache, sino esta busca en la red y 
    // si se encuentra lo guarda en cache
    
    /* event.respondWith(caches.match(event.request).then(
        cacheResponse => {
            return cacheResponse || fetch(event.request).then(
                networkResponse => {

                    //limpiarCache()
                    caches.open(cacheName).then(function (cache){
                        cache.put(event.request, networkResponse);

                    })
                    return networkResponse.clone()
                }
            )
        }
    )) */

    event.respondWith(caches.match(event.request).then(
        cacheResponse => {
            //Si estuvo en cache, lo va a regresar
            if(cacheResponse) return cacheResponse;
            //Sino estuvo en cache, lo va a buscar a la red
            return fetch(event.request).then(
                networkResponse => {
                    caches.open(dynamic_cache).then(cache => {
                        cache.put(event.request, networkResponse)
                        // Tarea: Funcion de limpiar el cache
                    })
                }
            )
        }
    ))
    
})

//Hola
function limpiarCache() {

    // Identificar al cache - keys
    // Borrarlo - delete
    //Actualizarlo
    
}
/*self.addEventListener('message', msj => {
    console.log('Mensaje desde el sw', + msj.data.action);
})*/


self.addEventListener('message', msj => {
    //Revisar si el msj tiene el mensaje skipWaiting
    if(msj.data.action == 'skipWaiting'){
        self.skipWaiting();
      
    }
})


