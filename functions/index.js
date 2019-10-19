const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey.json");
var app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ichat-ictech.firebaseio.com"
});

//console.log("IChat Functions Start => ", new Date().toString())
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
const mail_p1 = '<!DOCTYPE html><!-- Copyright © Imesh Chamara 2019 --><html lang="en"><head><meta charset="utf-8"/><title>IChat</title><meta name="author" content="Imesh Chamara"/><meta http-equiv="X-UA-Compatible" content="IE=edge"/><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style type="text/css">*{font-family:Roboto,Helvetica,"Segoe UI Emoji",-apple-system,BlinkMacSystemFont,Arial,"IC Noto Sans Sinhala","Segoe UI",Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif;font-size:16px;}.uc1{font-size:12px;color:#444;text-align:right;width:100%;display:block;text-decoration:none;}.uc2{font-size:14px;width:100%;display:block;text-decoration:none;}</style></head><body style="margin:0; width:100%; padding:0;"><center style="width:100%; background:#F2F2F2; text-align:left; padding:20px 0;"><div style="border:1px solid #cfcfcf; border-radius:4px; overflow:hidden; margin:20px auto 0; width:600px; max-width:480px;box-shadow:0 0 10px #00000030;background-color:#ffffff;"><table style="width:100%;" cellspacing="0" align="center"><tbody><tr align="center"><td width="12px"></td><td><table style="width:100%;" cellspacing="0" align="center"><tbody><tr style="background-color:#fff" bgcolor="#ffffff" align="center"><td><a href="https://ichat-ictech.web.app/"><div style="height:88px; overflow:hidden;"><img src="https://ichat-ictech.web.app/images/artboard-10-128px-email.png" width="128px"></div></a></td><!-- <td><a href="https://ic-tech.now.sh/"><div tyle="width:222px; height:88px; overflow:hidden;"><img src="https://i.imgur.com/7BM6r9H.png" style="margin-top:24px;" width="222px"></div></a></td> --></tr><tr align="center"><td><span style="font-size:24px;">IChat</span></td></tr>'
const mail_p2 = '<tr><td><span class="uc2" style="margin-top:10px;">Thank you,</span><span class="uc2">Imesh Chamara, IC-Tech</span><a href="http://ic-tech.dx.am/" class="uc2">http://ic-tech.dx.am</a></td></tr><tr><td><span class="uc1" style="margin-top:10px;">Copyright © 2019 mesh Chamara. All rights reserved.</span><a href="https://ic-tech.now.sh/" style="text-decoration:none;"><span class="uc1">IC-Tech.</span></a></td></tr></tbody></table></td><td width="12px"></td></tr></tbody></table></div></center></body></html>\n'
/*
exports.sendWelcomeEmail = functions.auth.user().onCreate(async user => {
	const Op = {
    from: `"IC-Tech" ${CEmail}`,
    to: user.email,
    subject: 'Welcome to IChat',
    html: mail_p1 + '<tr><td><span>Thanks for signup for IChat. But I\'m so sorry, IChat is not completely finished developing. Some functions will unavailable to use. I will inform when you this project finished.</span></td></tr>' + mail_p2
  }
  try {
    await mailTransport.sendMail(Op)
  } catch(error) {
    console.error('There was an error while sending the email:', error)
  }
})
*/
exports.getUser = functions.https.onRequest(async (req, res) => {
	var q = queryC(req, res, 'uid')
	if(q === false) return
	var a
	try {
	  res.send(Send(sendJ(await admin.auth().getUser(q[0]), 'uid', 'displayName', 'photoURL')))
	}
	catch(e) {
		if(e.code === 'auth/user-not-found') return sysErr(res, ['User not found'])
		return sysErr(res)
	}
})
