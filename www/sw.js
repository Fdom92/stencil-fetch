importScripts('workbox-sw.prod.v2.1.2.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
  {
    "url": "build/fetch.js",
    "revision": "02f22b92dac0e9495cd2eb69252547e8"
  },
  {
    "url": "build/fetch/bywc7skv.js",
    "revision": "a81da04581ec306e45aff8aa8a3d0d4c"
  },
  {
    "url": "build/fetch/fetch.2ssxvyz5.js",
    "revision": "bff916c23d35e0a565988a3d8ca10f09"
  },
  {
    "url": "build/fetch/fetch.gmvdjvnw.js",
    "revision": "7e2c6d2123e26c497287ba092bb27c50"
  },
  {
    "url": "build/fetch/fetch.owxfbm0m.js",
    "revision": "a2495208acdcc2d06455b57e5ebe14ef"
  },
  {
    "url": "build/fetch/fetch.registry.json",
    "revision": "7533efc9b99a5907ebfc0e2104a2440a"
  },
  {
    "url": "build/fetch/t7cysrt3.js",
    "revision": "7ac5e8b091a70d700203cfd306a1e97d"
  },
  {
    "url": "favicon.ico",
    "revision": "d2f619d796fbe8bed6200da2691aa5b6"
  },
  {
    "url": "index.html",
    "revision": "787f5158ce955e883a898f64c80e7b35"
  },
  {
    "url": "workbox-sw.prod.v2.1.0.js",
    "revision": "e5f207838d7fd9c81835d5705a73cfa2"
  }
];

const workboxSW = new self.WorkboxSW({
  "skipWaiting": true,
  "clientsClaim": true
});
workboxSW.precache(fileManifest);
