import Vue from 'vue'
// 剪切板
import VueClipboard from 'vue-clipboard2'

// 引入视频插件
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import '@/common/mixin'
import * as filters from '@/common/filter' // global filters
import has from '@/utils/btnAuthority'

// 带有灰色底的标题
import Tip from '@/components/Tool/Tip'
import Pagination from '@/components/Pagination'

// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(VueClipboard)
Vue.use(VideoPlayer)
Vue.use(ElementUI, { locale })
Vue.use(ElementUI)

// 挂载标题组件至全局
Vue.component('tip', Tip)
Vue.component('Pagination', Pagination)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  directives: has,
  render: h => h(App)
})
