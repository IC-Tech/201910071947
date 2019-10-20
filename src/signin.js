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
		this.provider = new firebase.auth.GoogleAuthProvider();
		this.provider.addScope('https://www.googleapis.com/auth/userinfo.email')
	}
	didMount() {
		firebase.auth().onAuthStateChanged(user => {
			this.update({user, UI: 1})
		})
		firebase.auth().getRedirectResult().then(a => {
			if (a.user) {
				location = location.origin
			}
		})
		document.addEventListener('click', a => {
			a = {a: new icApp.e(a.target), b: 0}
			for(var b=0; b<3 && a.b == 0; b++)
				a.b = (a.a.v.id == 'menu-btn' ? 1 : (a.a = a.a.p) ? 0 : 0)
			if(a.b == 0) icApp.ds({t: 'mb'}).v.checked = false
		})
		this.update({ready:true})
	}
	didUpdate() {}
	close() {
		window.close()
	}
	GSignin() {
		firebase.auth().signInWithRedirect(this.provider)
	}
	signout() {
		firebase.auth().signOut()
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
						{ t: 'div', s: {display: !this.data.user ? 'flex' : 'none'}, ch: [
							{t: 'span', txt: 'Signin To IChat', cl: 'c01' },
							{t: 'div', ch: [
								{t: 'span', cl: 'ic-btn0', txt: 'Sign in with Google', e:[['onclick', a => this.GSignin()]] },
								{t: 'span', cl: ['ic-btn0', 'dis'], txt: 'Sign in with Email' },
								{t: 'span', cl: ['ic-btn0', 'dis'], txt: 'Sign in with Twitter' },
								{t: 'span', cl: ['ic-btn0', 'dis'], txt: 'Sign in with Github' },
								{t: 'span', cl: ['ic-btn0', 'dis'], txt: 'Sign in with Yahoo' },
								{t: 'span', cl: ['ic-btn0', 'dis'], txt: 'Sign in with Facebook' },
								{t: 'span', cl: ['ic-btn0', 'dis'], txt: 'Sign in with Microsoft' }
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
