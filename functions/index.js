const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey.json");
var app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ichat-ictech.firebaseio.com"
});
const db = admin.firestore()

//console.log("IChat Functions Start => ", new Date().toString())
const sendJ = (a,...b) => {
	var c = {}
	b.forEach(b => typeof a[b] !== undefined ? (c[b] = a[b]) : 0)
	return c
}
const Send = (a, b = true) => JSON.stringify({response: a, success: b})
const JInit = a => ([
	['Access-Control-Allow-Origin', '*'],
  ['Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'],
  ['Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept'],
  ['WebServer', 'IC-Tech Server; Copyright (c) Imesh Chamara 2019'],
  ['Content-Type', 'application/json; charset=UTF-8']
]).forEach(b => a.set(b[0], b[1]))
const queryC = (a,d, ...b) => {
	JInit(d)
	var c = []
	b = b.map((b, d) => a.query[b] && a.query[b] !== '' ? a.query[b] : c.push(b + ' is required'))
	if(c.length > 0) {
		d.send(Send(c, false))
	}
	return c.length > 0 ? false : b
}
const sysErr = (a, b) => {
	JInit(a)
	a.send(Send(b ? b : ['Failed to response', 'undefined system error', 'Internal Server Error'], false))
}
exports.createUserDB = functions.auth.user().onCreate(async u => {
	var a = await db.collection('users').doc(u.uid).set({uid: u.uid, about: '', tags: []})
});
exports.getUser = functions.https.onRequest(async (req, res) => {
	var q = queryC(req, res, 'uid')
	if(q === false) return
	var a
	try {
	  res.send(Send(sendJ(await admin.auth().getUser(q[0]), 'uid', 'displayName', 'photoURL')))
	}
	catch(e) {
		if(e.code === 'auth/user-not-found') return sysErr(res, ['User not found'])
		console.error(e)
		return sysErr(res)
	}
})
exports.getFullUser = functions.https.onRequest(async (req, res) => {
	var q = queryC(req, res, 'uid')
	if(q === false) return
	try {
		var a = await admin.auth().getUser(q[0])
		var b = await db.collection('users').doc(q[0]).get()
	  res.send(Send(Object.assign(sendJ(a, 'uid', 'displayName', 'photoURL'), sendJ(b.data(), 'about', 'tags'))))
	}
	catch(e) {
		if(e.code === 'auth/user-not-found') return sysErr(res, ['User not found'])
		console.error(e)
		return sysErr(res)
	}
})
exports.sendNotifications = functions.firestore.document('messages/{messageId}').onCreate(async a => {
	a = a.data()
	var c = await admin.auth().getUser(a.uid)
	const tokens = (await admin.firestore().collection('fcmTokens').get()).map(a => a.id)
	if (tokens.length <= 0) return
	const b = await admin.messaging().sendToDevice(tokens, {
		title: `${c.displayName} posted a message`,
		body: a.m ? (a.m.length <= 100 ? a.m : a.m.substring(0, 97) + '...') : '',
    icon: c.photoURL || '/images/avatar/default.png',
    click_action: `https://${process.env.GCLOUD_PROJECT}.web.app`
	})
	c = []
	b.results.forEach((b, a) => {
		var e = b.error
    if (e && e.code === 'messaging/invalid-registration-token' || e.code === 'messaging/registration-token-not-registered')
    	c.push(admin.firestore().collection('messages').doc(tokens[a]).delete())
   })
	await Promise.all(c)
})
