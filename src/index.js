/* Copyright © Imesh Chamara 2019 */
'use strict';
import './icApp.js'
import {Theme, initTheme, setTheme} from './Theme.js'
import {IAR} from './icApp-render.js'
import {IC_DEV, XHR} from './common.js'
import {dialogUI} from './dialog-ui.js'
import './style.scss'
import './dialog.scss'

document.addEventListener('DOMContentLoaded', () => {
let icApp = ic.icApp
firebase.performance()
var _root_ = new icApp.e('#root')
Theme.set('red')

const defaultWait = 1200
const Project = '201910071947'
const PublicName = 'IChat'

class IChat extends IAR {
	constructor() {
		super()
		this.data = {
			UI: 0,
			UI2: 0,
			ready: false
		}
		this.send = this.send.bind(this)
		var a = firebase.app().options
		this.functions = IC_DEV ? `http://192.168.8.20:5001/${a.projectId}/${a.locationId}1/` : `https://us-central1-${a.projectId}.cloudfunctions.net/`
		this.users = JSON.parse(localStorage.getItem('IC-Tech.IChat:Users'))
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
					this.users[a.uid].a = true
					localStorage.setItem('IC-Tech.IChat:Users', JSON.stringify(this.users))
					this.update()
				})
			}
			return this.users
		}
		this.messages = []
		this.mc = a => ([this.userInit(a.u),({t:'div', cl: ['ms', this.user == a.u ? 'm2': 'm1'], ch: /*this.user == a.u ? [this.mc.a(a)] :*/ [
			{t:'div', at:[['title', this.users[a.u].name]], s: {'background-image': this.users[a.u].image ? `url("${this.users[a.u].image}")` : '' }},
			this.mc.a(a)
		]})])[1]
		this.mc.a = a => ({t:'div', cl: 'con', ch: [
				{t: 'span', txt: a.m },
				{t: 'span', txt: new Date(a.t).toString() }
			]})
		this.mess = (a => {
			window.ic.t = a
			console.log(a.docChanges())
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
	start(user) {
		if(!user || this.started) return
		this.user = user.uid
		this.firestore = firebase.firestore()
		this.firestore.collection('messages').orderBy('t', 'asc').limit(20).onSnapshot(this.mess)
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
	}
	send(a) {
		if(!this.user) return
		var a = icApp.ds({t:'mess',i:'0'}).v
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
	close() {
		window.close()
	}
	render() {
		return ([
			{ s: {display: this.data.ready ? 'flex' : 'none'}, ch: [
				{ ch: [
					{},
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
			{ s: {display: !this.data.ready ? 'flex' : 'none'} }
		])
	}
}
new IChat().mount(_root_.v)
})
