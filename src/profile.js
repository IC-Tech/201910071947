/* Copyright © Imesh Chamara 2019 */
import './icApp.js'
import {Theme, initTheme, setTheme} from './Theme.js'
import {IAR} from './icApp-render.js'
import {IC_DEV, XHR, pram} from './common.js'
import './profile.scss'

document.addEventListener('DOMContentLoaded', () => {
let icApp = ic.icApp
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
			ready: false,
			d: null,
			edit: false
		}
		this.analytics = firebase.analytics()
		this.performance = firebase.performance()
		var a = firebase.app().options
		this.functions = IC_DEV ? `http://192.168.8.20:5001/${a.projectId}/${a.locationId}1/` : `https://us-central1-${a.projectId}.cloudfunctions.net/`
	}
	didMount() {
		firebase.auth().onAuthStateChanged(user => {
			this.update(Object.assign({user}, user ? ({}) : ({UI:1})))
			gtag('event', 'screen_view', { 'screen_name': this.data.user ? 'selfView' : 'profileView'})
			if(!user) return
			this.analytics.setUserId(user.uid)
			var a = pram('tid')
			if(!a) {
				a = this.data.user.uid
				var b = new URL(location.href)
				b.searchParams.set('tid', a)
				history.pushState({IC_Nav: true}, icApp.qs('title').txt, b.href)
			}
			XHR(this.functions + 'getFullUser?uid=' + a, a => {
				if(!a || !a.success) {
					console.log(a)
					return
				}
				this.update({UI: 1, d: a.response})
			})
		})
		document.addEventListener('click', a => {
			a = {a: new icApp.e(a.target), b: 0}
			for(var b=0; b<3 && a.b == 0; b++)
				a.b = (a.a.v.id == 'menu-btn' ? 1 : (a.a = a.a.p) ? 0 : 0)
			if(a.b == 0) icApp.ds({t: 'mb'}).v.checked = false
		})
		this.update({ready:true})
	}
	didUpdate() {
		var a = icApp.ds({t: 'edit', i:0})
		if(this.data.d && a.val != this.data.d.displayName) a.val = this.data.d.displayName
		a = icApp.ds({t: 'edit', i:1})
		if(this.data.d && a.val != this.data.d.about) a.val = this.data.d.about
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
						{ s: {display: this.data.user ? 'flex' : 'none'}, ch: [
							{ ch: [
								{ s: {'background-image': `url(${this.data.d ? this.data.d.photoURL : ''})`}},
								{ s: {display: !this.data.edit ? 'none': 'block'}}
							]},
							{ s: {display: this.data.edit ? 'none': 'block'}, txt: this.data.d ? this.data.d.displayName : '' },
							{ s: {display: !this.data.edit ? 'none': 'block'}, d: {t: 'edit', i:0} },
							{ ch: this.data.d ? this.data.d.tags.map(a => ({t:'span', txt: a})) : ([]), s: {display: this.data.d && this.data.d.tags.length > 0 ? 'block' : 'none'} },
							{ s: {display: this.data.edit ? 'none': 'block'}, txt: this.data.d ? this.data.d.about : '' },
							{ s: {display: !this.data.edit ? 'none': 'block'}, txt: this.data.d ? this.data.d.about : '', d: {t: 'edit', i:1} },
							{ s: {display: this.data.edit ? 'none': 'block'}, ch: [ { txt: this.data.d ? (this.data.d.uid == this.data.user.uid ? 'Edit' : 'Message') : ''} ], e: [['onclick', a => {
								if((a = new icApp.e(a.target).txt) == 'Edit') this.update({edit: true})
								gtag('event', 'edit_ac_' + a.toLowerCase())
								if(a != 'Edit') location = location.origin + '/?ac=message'
							}]]},
							{ s: {display: this.data.edit ? 'none': 'block'}, ch: [ { txt: this.data.d ? (this.data.d.uid == this.data.user.uid ? 'Logout' : 'Your Profile') : '' }], e: [['onclick', a => {
								if((a = new icApp.e(a.target).txt) == 'Logout') firebase.auth().signOut()
								gtag('event', 'edit_ac_' + a.toLowerCase())
								location = location.origin + (a == 'Logout' ? '/signin.html' : '/profile.html')
							}]]},
							{ s: {display: !this.data.edit ? 'none': 'block'}, ch: [
								{ e: [['onclick', a => this.update({edit: false})]]},
								{ }
							]}
						]},
						{ s: {display: !this.data.user ? 'flex' : 'none'} }
					]}
				]}
			]},
			{ s: {display: !this.data.ready ? 'flex' : 'none'} }
		])
	}
}
new IChat().mount(_root_.v)
})
