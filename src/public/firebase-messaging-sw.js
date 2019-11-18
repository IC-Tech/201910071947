importScripts('/__/firebase/7.3.0/firebase-app.js');
importScripts('/__/firebase/7.3.0/firebase-messaging.js');
importScripts('/__/firebase/init.js');
importScripts('/ga.js');

const messaging = firebase.messaging();
/*
	self.indexedDB = self.indexedDB || self.mozIndexedDB || self.webkitIndexedDB || self.msIndexedDB;
	var DBRequest = self.indexedDB.open("IChat-v1", 4);
	var db = null;
	var Settings = {}
	DBRequest.onsuccess = a => {
		db = DBRequest.result
		Settings.a = 
	};
	DBRequest.onupgradeneeded = a => {
		db = a.target.result
		a = db.createObjectStore("IChat", { keyPath: "Settings" })
		a.createIndex('showNotification', 'true')
	};
*/
self.addEventListener("activate", e => {
	e.waitUntil(self.clients.claim())
});
messaging.setBackgroundMessageHandler(a => {
	self.registration.getNotifications().then(a => a.forEach(a => a.close()))
  return self.registration.showNotification((a = a.data).a, {body: a.b, icon: a.c, timestamp: a.d });
});
self.addEventListener('notificationclose', a => ga('close', 'notification'))
self.addEventListener('notificationclick', a => {
	a.notification.close()
	a.waitUntil(new Promise(a => setTimeout(a, 500)).then(a => clients.matchAll({includeUncontrolled: true, type: "window"}).then(a => a.some(a => ([a = [a.url == location.origin || a.url == (location.origin + '/'), a], a[0] ? a[1].focus() : 0, a[0]])[2]))))
	ga('click', 'notification')
});
