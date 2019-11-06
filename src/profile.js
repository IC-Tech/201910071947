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
		this.save = this.save.bind(this)
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
			var _a = !a
			var b = new URL(location.href)
			b.searchParams.set('tid', a = a ? a : this.data.user.uid)
			if(_a) history.pushState({IC_Nav: true}, icApp.qs('title').txt, b.href)
			XHR(this.functions + 'getFullUser?uid=' + a, a => {
				if(!a || !a.success) {
					console.log(a)
					return
				}
				new icApp.e('title').txt = (a = a.response).displayName + ' | IChat'
				icApp.qs('meta[property="og:url"]').content = b.href
				icApp.qs('meta[property="og:title"]').content = a.displayName + ' | IChat'
				icApp.qs('meta[property="og:image"]').content = a.photoURL
				icApp.qs('meta[property="og:description"]').content = a.displayName + '\'s IChat Profile'
				this.update({UI: 1, d: a})
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
		if(!this.data.edit && this.data.d && a.val != this.data.d.displayName) a.val = this.data.d.displayName
	}
	save(a) {
		this.update({UI:0})
		a = [icApp.ds({t: 'edit', i:0}).val, icApp.ds({t: 'edit', i:1}).html.replace(/<br\/?>/gim, '\n'), this.image, {}]
		var b = firebase.auth().currentUser
		if(b.displayName != a[0]) a[3].displayName = a[0]
		var _a = () => {
			if(Object.keys(a[3]).length > 0) {
				b.updateProfile(a[3]).then(a => {
					a = firebase.auth().currentUser
					this.data.d.displayName = a.displayName
					this.data.d.photoURL = a.photoURL
					this.update({UI: 1, edit:false})
					gtag('event', 'edit_done_t1')
				}).catch(a => console.log('error',a))
			}
			else this.update({UI: 1, edit:false})
		}
		var _b = () => {
			if(a[1] != this.data.d.about) {
				var c = firebase.firestore().collection('users').doc(b.uid).update({about: a[1]}).then(a=> {
					gtag('event', 'edit_done_t2')
					_a()
				})
				this.data.d.about = a[1]
			}
			else _a()
		}
		if(a[2]) {
			var c = icApp.qs('input[type="file"]').files[0]
			firebase.storage().ref().child(`users/${b.uid}/images/pp/${c.name}`).put(this.image, {contentType: c.type, customMetadata: {u:b.uid, c: Date.now(), lastModified: c.lastModified, source: 'profile.js'}}).then(c => c.ref.getDownloadURL().then(c => {
				a[3].photoURL = c
				_b()
			})).catch(e => console.log('error', e))
		}
		else _b()
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
								{ d: {t:'img', i:0}, s: {'background-image': `url(${this.data.d ? this.data.d.photoURL : ''})`}},
								{ s: {display: !this.data.edit ? 'none': 'block'}, ch: [
									{ e: [['oninput', e => {
										var t = e.target.files[0]
										if(!FileReader) return
										var f = new FileReader()
										f.onload = e => icApp.ds({t:'img', i:0}).st.backgroundImage = `url(${URL.createObjectURL(this.image = new Blob([e.target.result], {type: t.type}))})`
										f.readAsArrayBuffer(t)
									}
									]]},
									{}
								]}
							]},
							{ s: {display: this.data.edit ? 'none': 'block'}, txt: this.data.d ? this.data.d.displayName : '' },
							{ s: {display: !this.data.edit ? 'none': 'block'}, d: {t: 'edit', i:0} },
							{ ch: this.data.d ? this.data.d.tags.map(a => ({t:'span', txt: a})) : ([]), s: {display: this.data.d && this.data.d.tags.length > 0 ? 'block' : 'none'} },
							{ s: {display: this.data.edit ? 'none': 'block'}, txt: this.data.d ? this.data.d.about : '' },
							{ s: {display: !this.data.edit ? 'none': 'block'}, txt: !this.data.edit && this.data.d ? this.data.d.about : null, d: {t: 'edit', i:1} },
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
								{ e: [['onclick', this.save]]}
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
