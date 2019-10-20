/* Copyright © Imesh Chamara 2019 */
import './icApp.js'
import {Theme, initTheme, setTheme} from './Theme.js'
import {IAR} from './icApp-render.js'
import {IC_DEV, XHR} from './common.js'
import './style.scss'

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
		var a = firebase.app().options
		this.functions = IC_DEV ? `http://192.168.8.20:5001/${a.projectId}/${a.locationId}1/` : `https://${a.locationId}1-${a.projectId}.cloudfunctions.net/`
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
	}
	didMount() {
		firebase.auth().onAuthStateChanged(user => {
			if(user) this.user = user.uid
			this.update({user, UI: 1})
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
							{}
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
