/* Copyright © Imesh Chamara 2019 */
import './icApp.js'
import {Theme, initTheme, setTheme} from './Theme.js'
import {IAR} from './icApp-render.js'
import {IC_DEV} from './common.js'
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
	}
	didMount() {
		firebase.auth().onAuthStateChanged(user => {
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
						{ ch: [
							{}, {}, {},
							{ ch: [
								{ s: {display: !this.data.user ? 'inline-block' : 'none' }},
								{ s: {display: this.data.user ? 'inline-block' : 'none' }}
							]}
						]},
						//{}
					]}
				]}
			]},
			{ s: {display: !this.data.ready ? 'flex' : 'none'} }
		])
	}
}
new IChat().mount(_root_.v)
})
