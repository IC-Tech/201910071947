/* Copyright © Imesh Chamara 2019 */
import './icApp.js'
import {Theme, initTheme, setTheme} from './Theme.js'
import {IAR} from './icApp-render.js'
import {IC_DEV} from './common.js'
import './signin.scss'

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
			ready: false
		}
		this.analytics = firebase.analytics()
		this.performance = firebase.performance()
		this.googleProvider = new firebase.auth.GoogleAuthProvider()
		this.googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email')
		this.facebookProvider = new firebase.auth.FacebookAuthProvider()
		this.facebookProvider.addScope('email')
		this.facebookProvider.addScope('user_link')
		this.yahooProvider = new firebase.auth.OAuthProvider('yahoo.com')
		this.yahooProvider.addScope('mail-r')
		this.yahooProvider.addScope('sdps-r')
		this.githubProvider = new firebase.auth.GithubAuthProvider()
		this.githubProvider.addScope('user')
	}
	didMount() {
		firebase.auth().onAuthStateChanged(user => {
			this.update({user, UI: 1})
			if(user) this.analytics.setUserId(user.uid)
			if(!user && document.referrer) sessionStorage.setItem('referrer', document.referrer)
			else if(!user) sessionStorage.removeItem('referrer')
			gtag('event', 'screen_view', { 'screen_name': this.data.user ? 'signedUser' : 'sign'})
		})
		firebase.auth().getRedirectResult().then(a => {
			const b = a => location = sessionStorage.getItem('referrer') ? sessionStorage.getItem('referrer') : location.origin
			if (a.user) {
				var c = a.additionalUserInfo.providerId
				gtag('event', a.additionalUserInfo.isNewUser ? 'sign_up' : 'login', {
					method : (c.substring(0, 1).toUpperCase() + c.substr(1)).substr(0, (c = c.indexOf('.')) > 0 ? c : undefined),
					'event_callback': a => b()
				})
				setTimeout(a => {
					gtag('event', 'exception', {'description': 'gtag event_callback failed', 'fatal': false})
					b()
				}, 4000)
			}
		})
		document.addEventListener('click', a => {
			a = {a: new icApp.e(a.target), b: 0}
			for(var b=0; b<3 && a.b == 0; b++)
				a.b = (a.a.v.id == 'menu-btn' ? 1 : (a.a = a.a.p) ? 0 : 0)
			if(a.b == 0) icApp.ds({t: 'mb'}).v.checked = false
		})
		this.update({ready:true})
		;(['page_mount_end', 'Signin Page Load']).forEach(a => gtag('event', a, {
  		'name': 'pageMount',
  		'value': Date.now() - window.ic.pageLoad,
  		'event_category': 'timing',
  		'event_label': 'IC App'
		}))
	}
	didUpdate() {}
	close() {
		window.close()
	}
	GSignin() {
		firebase.auth().signInWithRedirect(this.googleProvider)
	}
	FSignin() {
		firebase.auth().signInWithRedirect(this.facebookProvider)
	}
	YSignin() {
		firebase.auth().signInWithRedirect(this.yahooProvider)
	}
	GitSignin() {
		firebase.auth().signInWithRedirect(this.githubProvider)
	}
	signout() {
		firebase.auth().signOut()
		gtag('event', 'logout')
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
						{ t: 'div', s: {display: !this.data.user ? 'flex' : 'none'}, ch: [
							{t: 'span', txt: 'Signin To IChat', cl: 'c01' },
							{t: 'div', ch: [
								{t: 'span', cl: 'ic-btn0', txt: 'Sign in with Google', e:[['onclick', a => this.GSignin()]] },
								{t: 'span', cl: ['ic-btn0', 'dis'], txt: 'Sign in with Email' },
								{t: 'span', cl: ['ic-btn0', 'dis'], txt: 'Sign in with Twitter' },
								{t: 'span', cl: 'ic-btn0', txt: 'Sign in with Github', e:[['onclick', a => this.GitSignin()]] },
								{t: 'span', cl: 'ic-btn0', txt: 'Sign in with Yahoo', e:[['onclick', a => this.YSignin()]] },
								{t: 'span', cl: 'ic-btn0', txt: 'Sign in with Facebook', e:[['onclick', a => this.FSignin()]] }
							]}
						]},
						{ t: 'div', s: {display: this.data.user ? 'flex' : 'none'}, ch: [
							{t: 'span', txt: 'IChat', cl: 'c01' },
							{t: 'span', txt: 'You have already signin to IChat.', cl: 'c03' },
							{t: 'div', ch: [
								{t: 'a', cl: 'ic-btn0', at: [['href', '/']], txt: 'IChat' },
								{t: 'span',cl: 'ic-btn0',  txt: 'Signout', e:[['onclick', a => this.signout()]] }
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
