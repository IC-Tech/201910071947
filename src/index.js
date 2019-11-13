/* Copyright © Imesh Chamara 2019 */
'use strict';
import './icApp.js'
import {Theme, initTheme, setTheme} from './Theme.js'
import {IAR} from './icApp-render.js'
import {IC_DEV, XHR} from './common.js'
import {dialogUI} from './dialog-ui.js'
import './style.scss'
import './dialog.scss'
window.ic = window.ic || []
window.ic.pageLoad = Date.now()
document.addEventListener('DOMContentLoaded', () => {
let icApp = ic.icApp
var _root_ = new icApp.e('#root')
Theme.set('red')

if ("serviceWorker" in navigator && !navigator.serviceWorker.controller) {
  navigator.serviceWorker.register("firebase-messaging-sw.js").then(reg => {
  	firebase.messaging().useServiceWorker(reg)
  }).catch(e => {
    console.log('SW Registration failed with ' + e);
  })
}

new Promise((resolve, reject) => {
  const b = Notification.requestPermission(a => resolve(a))
  if (b) {
    b.then(resolve, reject);
  }
}).then(a => {
  if (a !== 'granted') {
    throw new Error('We weren\'t granted permission.');
  }
})

const defaultWait = 1200
const Project = '201910071947'
const PublicName = 'IChat'

class IChat extends IAR {
	constructor() {
		super()
		this.data = {
			UI: 0,
			UI2: 0,
			ready: false,
			profileD: null,
			showProfile: false
		}
		this.send = this.send.bind(this)
		this.closeProfile = this.closeProfile.bind(this)
		var a = firebase.app().options
		this.analytics = firebase.analytics()
		this.performance = firebase.performance()
		this.functions = IC_DEV ? `http://localhost:5001/${a.projectId}/${a.locationId}1/` : `https://us-central1-${a.projectId}.cloudfunctions.net/`
		this.users = []
		if(!this.users) this.users = {}
		this.user = ''
		this.userInit = a => {
			if(a && !this.users[a]) {
				this.users[a] = {uid: a, name: '', image: '', a: false}
				XHR(this.functions + 'getUser?uid=' + a, a => {
					if(!a || !a.success) {
						return
					}
					this.users[(a = a.response).uid] = {uid: a.uid, name: a.displayName, image: a.photoURL}
					this.update()
				})
			}
			return this.users
		}
		this.messages = []
		this.showProfile = a => {
			a = new icApp.e(a.target)
			if(a.d.t != 'msg-p') return
			this.update({profileD: a.d.u, showProfile: true})
		}
		this.mc = a => ([this.userInit(a.u),({t:'div', cl: ['ms', this.user == a.u ? 'm2': 'm1'], ch: /*this.user == a.u ? [this.mc.a(a)] :*/ [
			{t:'div', at:[['title', this.users[a.u].name]], s: {'background-image': `url("${ this.users[a.u].image ? this.users[a.u].image : ''}"), url("/images/avatar/default.gif")` }, d: {t:'msg-p', u: a.u}, e: [['onclick', this.showProfile]]},
			this.mc.a(a)
		]})])[1]
		this.mc.a = a => {
			var f = a.m
			var b = /(?:https?:\/\/(?:www\.)?)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
			var c = Array.from(f.matchAll(b))
			var d = f.split(b)
			if(c.length > 0) {
				f = []
				for(var e = 0; e<c.length; e++) {
					f.push(d[e])
					f.push({t:'a', at:[['href', c[e][0]]], txt: c[e][0]})
				}
				f.push(d[d.length - 1])
			}
			return ({t:'div', cl: 'con', ch: [
				Object.assign({t: 'span'}, typeof f == 'string' ? ({txt: f}) : ({nodes: 1, ch: f})),
				{t: 'span', txt: new Date(a.t).toString() }
			]})
		}
		this.mess = (a => {
			a.docChanges().map(a => ({a: a.type == "added" ? 0 : (a.type == "modified" ? 1 : 2), i: (a = a.doc).id, d: a.data()})).forEach((a,b) => {
				a.d.i = a.i
				a.d.t = a.d.t ? a.d.t.toDate().getTime() : Date.now()
				if(a.a == 0) this.messages.push(a.d)
				else if(a.a == 1) {
					this.messages = this.messages.map(b => a.i != b.i ? b : a.d)
				}
				this.update()
			})
		}).bind(this)
	}
	saveFCM() {
		firebase.messaging().getToken().then(a => {
    	if (a) firebase.firestore().collection('fcmTokens').doc(a).set({uid: firebase.auth().currentUser.uid})
    	else requestPermissions()
	  }).catch(e => {
	    console.error('Unable to get messaging token.', e);
	  });
	}
	requestPermissions() {
	  firebase.messaging().requestPermission().then(() => saveFCM()).catch(e => {
	    console.error('Unable to get permission to notify.', error);
	  })
	}
	start(user) {
		if(!user || this.started) return
		this.user = user.uid
		this.analytics.setUserId(this.user)
		this.firestore = firebase.firestore()
		this.firestore.collection('messages').orderBy('t', 'asc').limit(20).onSnapshot(this.mess)
		this.saveFCM()
		this.started = true
	}
	didMount() {
		firebase.auth().onAuthStateChanged(user => {
			this.update({user, UI: 1})
			this.start(user)
		})
		document.addEventListener('click', a => {
			a = {a: new icApp.e(a.target), b: 0}
			for(var b=0; b<3 && a.b == 0; b++)
				a.b = (a.a.v.id == 'menu-btn' ? 1 : (a.a = a.a.p) ? 0 : 0)
			if(a.b == 0) icApp.ds({t: 'mb'}).v.checked = false
		})
		this.update({ready:true})
		gtag('event', 'page_mount_end', {pageMount: Date.now() - window.ic.pageLoad})
	}
	send(a) {
		if(!this.user) return
		var a = icApp.ds({t:'mess',i:'0'}).v
		if(!a) return
		if(a.value.length >= 800) return dialogUI.create({name: 'Can not send Message', msg: 'The message was rejected by the server because the message was to large. maximum limit is 800 characters.', but: ['OK'],f: a=>dialogUI.remove(a.i)})
		a = ([a.value, a.value = '', a.focus()])[0]
		if(!a) return
		this.firestore.collection('messages').add({
			m: a,
			u: this.user,
			t: firebase.firestore.FieldValue.serverTimestamp()
		}).catch(e => console.error('Error writing new message to Firebase Database', e))
	}
	didUpdate() {}
	willUpdate() {
		if(this.data.UI2 != this.pevData.UI2) gtag('event', 'screen_view', { 'screen_name': (['homepage', 'messages'])[this.data.UI2] })
	}
	close() {
		window.close()
	}
	closeProfile(a) {
		this.update({showProfile: !new icApp.e(a.target).clc('profile-d')})
	}
	render() {
		return ([
			{ s: {display: this.data.ready ? 'flex' : 'none'}, ch: [
				{ ch: [
					{ e: [['onclick', a=> (a = location) == a.origin || a == a.origin + '/' ? 0 : (location = a.origin)]] },
					{ ch: [
						{}, {},
						{ ch: [
							{s: {display: !this.data.user ? 'inline-block' : 'none'}},
							{s: {display: this.data.user ? 'inline-block' : 'none'}, at:[['href', `/profile.html?tid=${this.data.user ? this.data.user.uid : ''}`]]},
							{}, {},
							{ e: [['onclick', this.close]]}
						]}
					]}
				]},
				{ ch: [
					{ s: {display: this.data.UI == 0 ? 'flex' : 'none'} },
					{ s: {display: this.data.UI == 1 ? 'flex' : 'none'}, ch: [
						{ s:{display: this.data.UI2 == 0 ? 'block' : 'none'}, ch: [
							{}, {}, {},
							{ ch: [
								{ s: {display: !this.data.user ? 'inline-block' : 'none' }},
								{ s: {display: this.data.user ? 'inline-block' : 'none' }, e: [['onclick', a => this.update({UI2: 1})]]}
							]}
						]},
						{ s:{display: this.data.UI2 == 1 ? 'block' : 'none'}, ch: [
							{ ch: [
								{},
								{ ch: this.messages.map(a => this.mc(a))}
							]}, 
							{ ch: [
								{},
								{ e: [['onclick', this.send ]]}
							]}
						]}
					]}
				]}
			]},
			{ s: {display: !this.data.ready ? 'flex' : 'none'} }, 
			{ s: {display: this.data.ready && this.data.showProfile ? 'block' : 'none'}, ch: [
				{t: 'div', cl: 'profile-d', e: [['onclick', this.closeProfile]], ch: [
					{t: 'div', d: {t:'pd', u: this.data.profileD ? this.data.profileD : ''}, ch: [
						{t: 'div', cl: 'a', s: {'background-image': `url("${ this.data.profileD ? this.users[this.data.profileD].image : ''}"), url("/images/avatar/default.gif")`}},
						{t: 'span', txt: this.data.profileD ? this.users[this.data.profileD].name : ''},
						{t:'a', txt: 'View', at: [['href', '/profile.html?tid=' + (this.data.profileD ? this.data.profileD : '')]]}
					]}
				]}
			]}
		])
	}
}
new IChat().mount(_root_.v)
})
