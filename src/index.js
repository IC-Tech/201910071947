/* Copyright © Imesh Chamara 2019 */
import './icApp.js'
import {Theme, initTheme, setTheme} from './Theme.js'
import {IAR} from './icApp-render.js'
import {IC_DEV} from './common.js'
import './style.scss'

document.addEventListener('DOMContentLoaded', () => {
let icApp = ic.icApp
let app = firebase.app()
var _root_ = new icApp.e('#root')
//_root_.chr()
Theme.set('red')

const defaultWait = 1200
const MaxChartData = 1000
const Project = '201910071947'
const PublicName = 'IChat'

class IChat extends IAR {
	constructor() {
		super()
		this.data = {
			UI: 0
		}
		setTimeout(a=> this.update({UI:1}), defaultWait)
	}
	didMount() {}
	didUpdate() {}
	render() {
		return (
			{ t: 'div', cl: 'ICApp', ch: [
				{ t: 'div', cl: 'app-bar' },
				{ t: 'div', cl: 'main', ch: [
					{ t: 'div', s: {display: this.data.UI == 0 ? 'flex' : 'none'}, cl: 'load' },
					{ t: 'div', s: {display: this.data.UI == 1 ? 'flex' : 'none'}, cl: 'cont', ch: [
					]}
				]}
			]}
		)
	}
}
new IChat().mount(_root_.v)
})
