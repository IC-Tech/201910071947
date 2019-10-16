const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey.json");
var app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ichat-ictech.firebaseio.com"
});

console.log("IChat Functions Start => ", new Date().toString())
const CEmail = functions.config().email.address;
const CPassword = functions.config().email.password;
const mailTransport = nodemailer.createTransport({
	host: 'smtp.mail.yahoo.com',
	port: 587,
	secure: false,
	auth: {
    user: CEmail,
    pass: CPassword
  },
	tls:{
		ciphers:'SSLv3'
	}
});

const sendJ = (a,...b) => {
	var c = {}
	b.forEach(b => a[b] ? (c[b] = a[b]) : 0)
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
	b = b.map((b, d) => a.query[b] && a.query[b] != '' ? a.query[b] : c.push(b + ' is required'))
	if(c.length > 0) {
		d.send(Send(c, false))
	}
	return c.length > 0 ? false : b
}
const sysErr = (a, b) => {
	JInit(a)
	a.send(Send(b ? b : ['Failed to response', 'undefined system error', 'Internal Server Error'], false))
}

exports.sendWelcomeEmail = functions.auth.user().onCreate(async user => {
});
exports.getUser = functions.https.onRequest(async (req, res) => {
	var q = queryC(req, res, 'uid')
	if(q == false) return
	var a
	try {
	  res.send(Send(sendJ(await admin.auth().getUser(q[0]), 'uid', 'displayName', 'photoURL')))
	}
	catch(e) {
		if(e.code == 'auth/user-not-found') return sysErr(res, ['User not found'])
		return sysErr(res)
	}
})
