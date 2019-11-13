/* Copyright © Imesh Chamara 2019 */
const CACHE = "ichat-v1_00-cache";
const offlinePage = "offline.html";
const getCache = a => caches.open(CACHE).then(b => b.match(a).then(a => (!a || a.status === 404) ? Promise.reject("no-match") : a))
const putCache = (a, b) => caches.open(CACHE).then(c => c.put(a, b))
self.addEventListener("install", e => {
	self.skipWaiting()
	e.waitUntil(
		caches.open(CACHE).then(a => a.addAll([
			offlinePage,
			'/images/error.png',
			'/android-chrome-192x192.png'
		]))
	)
});
self.addEventListener("activate", e => {
	e.waitUntil(self.clients.claim())
});
self.addEventListener("fetch", e => {
	if (e.request.method !== "GET" || !e.request.url.match(location.origin)) return
	e.respondWith(getCache(e.request).then(
		a => a,
		() => fetch(e.request)
		.then(a => {
			if(a.url.match(/\/(?:images|fonts|__\/firebase)\/.*/g)) e.waitUntil(putCache(e.request, a.clone()))
			return a
		})
		.catch(err => {
			if (e.request.destination !== "document" || e.request.mode !== "navigate") return
			return caches.open(CACHE).then(a => a.match(offlinePage));
		})
	))
});
self.addEventListener("refreshOffline", () => {
	const c = new Request(offlinePage);
	return fetch(offlinePage).then(a => {
		console.log('Offline page updated from refreshOffline event: '+ a.url);
		return caches.open(CACHE).then(b => b.put(c, a));
	});
});
