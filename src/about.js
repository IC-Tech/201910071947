/* Copyright © Imesh Chamara 2019 */
import './icApp.js'
import {Theme, initTheme, setTheme} from './Theme.js'
import {IAR} from './icApp-render.js'
import './about.scss'

window.ic = window.ic || []
window.ic.pageLoad = Date.now()
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
	}
	didMount() {
		firebase.auth().onAuthStateChanged(user => {
			this.update(Object.assign({user}, user ? ({}) : ({UI:1})))
			if(!user) return
			this.analytics.setUserId(user.uid)
			this.update({UI:1})
		})
		document.addEventListener('click', a => {
			a = {a: new icApp.e(a.target), b: 0}
			for(var b=0; b<3 && a.b == 0; b++)
				a.b = (a.a.v.id == 'menu-btn' ? 1 : (a.a = a.a.p) ? 0 : 0)
			if(a.b == 0) icApp.ds({t: 'mb'}).v.checked = false
		})
		icApp.qsa('a[data-t="con"]').forEach(a => new icApp.e(a).ae('click', a=> gtag('event', `${(['Website', 'Email', 'Phone'])[(a = new icApp.e(a.target)).d.i]} Contact Click`, {
  		'event_category': 'click',
  		'event_label': 'Contact'
		})))
		icApp.qsa('a[data-t="sha"]').forEach(a => new icApp.e(a).ae('click', a=> gtag('event', `${(['WhatsApp', 'Facebook', 'Twitter', 'Pinterest', 'Linkedin', 'Email'])[(a = new icApp.e(a.target)).d.i]} Share Click`, {
  		'event_category': 'click',
  		'event_label': 'Share'
		})))
		this.update({ready:true})
		;(['page_mount_end', 'About Page Load']).forEach(a => gtag('event', a, {
  		'name': 'pageMount',
  		'value': Date.now() - window.ic.pageLoad,
  		'event_category': 'timing',
  		'event_label': 'IC App'
		}))
	}
	didUpdate() {}
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
						{ }
					]}
				]}
			]},
			{ s: {display: !this.data.ready ? 'flex' : 'none'} }
		])
	}
}
new IChat().mount(_root_.v)
})
