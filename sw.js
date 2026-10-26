/* דיגמי – מאפשר התקנה כאפליקציה. שומר רק את המעטפת (הדף הזה והאייקונים); הנתונים תמיד מגיעים חיים מגוגל. */
var C = "digmi-shell-v1";
var FILES = ["./", "index.html", "config.js", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png"];
self.addEventListener("install", function (e) { e.waitUntil(caches.open(C).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== C; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var u = new URL(e.request.url);
  if (u.origin !== location.origin) return;            /* גוגל – תמיד ישר מהרשת */
  e.respondWith(fetch(e.request).then(function (r) {   /* קודם הרשת (גרסה עדכנית), ואם אין קליטה – המעטפת השמורה */
    var cp = r.clone(); caches.open(C).then(function (c) { c.put(e.request, cp); }); return r;
  }).catch(function () { return caches.match(e.request).then(function (r) { return r || caches.match("index.html"); }); }));
});
