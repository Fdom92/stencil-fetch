importScripts('workbox-sw.prod.v2.1.0.js');

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
    "revision": "aa681425c4d4a0046048e07375c02511"
  },
  {
    "url": "build/fetch/fetch.ifuywb22.js",
    "revision": "e1c2b8c865c1cd6b302032204a2111a6"
  },
  {
    "url": "build/fetch/fetch.registry.json",
    "revision": "11ad43d496d041b9d5f4b585864bb054"
  },
  {
    "url": "build/fetch/fetch.yhacfjei.pf.js",
    "revision": "60affa0f499ffc805f86dee09952ad44"
  },
  {
    "url": "build/fetch/qdeh8r7x.js",
    "revision": "bb5365dd3a33f52999fb26568d345537"
  },
  {
    "url": "favicon.ico",
    "revision": "d2f619d796fbe8bed6200da2691aa5b6"
  },
  {
    "url": "index.html",
    "revision": "618e5ab9a67384abb0fca642e381d1dd"
  }
];

const workboxSW = new self.WorkboxSW({
  "skipWaiting": true,
  "clientsClaim": true
});
workboxSW.precache(fileManifest);
