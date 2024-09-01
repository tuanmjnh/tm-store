import { createApp } from 'vue'
import { ConfigProvider } from 'vant'
import { i18n } from './i18n'
import { pinia } from './stores'
import { Icon } from 'vant';
import router from './router'
import App from './App.vue'
import plugins from './plugins'
import { createRouterScroller } from 'vue-router-better-scroller'
// Vant 桌面端适配
import '@vant/touch-emulator'
// normalize.css
import "./styles/normalize.css";
import './styles/index.less'
/* --------------------------------
Vant 中有个别组件是以函数的形式提供的，
包括 Toast，Dialog，Notify 和 ImagePreview 组件。
在使用函数组件时，unplugin-vue-components
无法自动引入对应的样式，因此需要手动引入样式。
------------------------------------- */
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'

// import router from './router'
const app = createApp(App)

app.use(pinia)
app.use(Icon)
app.use(router)
app.use(ConfigProvider)
app.use(i18n)
plugins(app)

// 增强了 Vue Router v4 的滚动行为
app.use(createRouterScroller({
  selectors: {
    'window': true,
    'body': true,
    '.scrollable': true,
  },
}))
app.mount('#app')
