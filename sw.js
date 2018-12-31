var CACHE_NAME = 'codenames-grid-v1';
var urlsToPrefetch = [
  './',
  './grid.js',
  './icon.png',
  './icon-192.png',
  './seedrandom.min.js',
  'https://d3js.org/d3.v4.min.js',
  'https://s3.amazonaws.com/github/ribbons/forkme_right_green_007200.png',
];

self.addEventListener('install', function(event) {
  const now = Date.now();
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).
      then(function(cache) {
        var cachePromises = urlsToPrefetch.map(function(urlToPrefetch) {
          const url = new URL(urlToPrefetch, location.href);
          url.search += (url.search ? '&' : '?') + 'cache-bust=' + now;
          const request = new Request(url, {mode: 'no-cors'});
          return fetch(request).then(function(response) {
            if (response.status >= 400) {
              throw new Error('request for ' + urlToPrefetch +
                ' failed with status ' + response.statusText);
            }
            return cache.put(urlToPrefetch, response);
          }).catch(function(error) {
            console.error('Not caching ' + urlToPrefetch + ' due to ' + error);
          });
        });
        return Promise.all(cachePromises);
      })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.url.match(/#/)) {
    event.request.url = event.request.url.replace(/#.*$/, '');
  }

  event.respondWith(
    // caches.match() will look for a cache entry in all of the caches available to the service worker.
    // It's an alternative to first opening a specific named cache and then matching on that.
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }

      // event.request will always have the proper mode set ('cors, 'no-cors', etc.) so we don't
      // have to hardcode 'no-cors' like we do when fetch()ing in the install handler.
      return fetch(event.request).then(function(response) {
        return response;
      }).catch(function(error) {
        // This catch() will handle exceptions thrown from the fetch() operation.
        // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
        // It will return a normal response object that has the appropriate error code set.
        console.error('Fetching failed:', error);

        throw error;
      });
    })
  );
});
