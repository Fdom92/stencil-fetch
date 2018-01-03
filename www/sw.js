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
    "revision": "8e98204f0f02abe9fb27c87d437819ea"
  },
  {
    "url": "build/fetch/fetch.1tclxjuc.js",
    "revision": "9a61738b748a0e258fee3da25a2f8d45"
  },
  {
    "url": "build/fetch/fetch.anhupqok.js",
    "revision": "a12222053b709ab2e4bb13955b0b0e90"
  },
  {
    "url": "build/fetch/fetch.registry.json",
    "revision": "86251279dc80c0bbe943808bc3d2a04a"
  },
  {
    "url": "build/fetch/fetch.v67vgvfw.js",
    "revision": "b0d0e8d3db96ac1040149f7358a11a17"
  },
  {
    "url": "build/fetch/jrkxpy2x.js",
    "revision": "f4cd14cb113ec79b4e9139f3a3088e54"
  },
  {
    "url": "build/fetch/stq2agql.js",
    "revision": "28078af1ad2b94c0ef50c29c2f79f7eb"
  },
  {
    "url": "favicon.ico",
    "revision": "d2f619d796fbe8bed6200da2691aa5b6"
  },
  {
    "url": "index.html",
    "revision": "11f717eea55fbcd80e77df8368604aa8"
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
