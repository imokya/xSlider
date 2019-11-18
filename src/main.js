import './css/style'

import $ from 'webpack-zepto'
import App from './app'
import Global from './global'

window.$ = $

const global = new Global()
const app = new App({
  el: '#app'
})

window.app = app
window.global = global