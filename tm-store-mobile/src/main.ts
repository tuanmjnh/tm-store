import type { App } from 'vue'
import { createApp } from 'vue'
import { i18n } from './i18n'
import { installPlugins } from './plugins'
import { installRouter } from '@/router'
import { installPinia } from '@/store'
// import Vue3TouchEvents from "vue3-touch-events"
import Vue3TouchEvents, { type Vue3TouchEventsOptions } from "vue3-touch-events"

// import { store } from '@/store'
import AppVue from './App.vue'
import AppLoading from './components/AppLoading.vue'
import { Notify } from 'vant'
import { Lazyload } from 'vant'
import { ImagePreview } from 'vant'
// import PrimeVue from 'primevue/config'
// import Aura from '@/presets/lara'      //import preset
// import presetBuild from '@/presetBuild'
// normalize.css
import 'normalize.css/normalize.css'
// 全局样式
import './styles/index.scss'
// tailwindcss
import './styles/tailwind.css'
// svg icon
// import 'virtual:svg-icons-register'

import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'
import 'md-editor-v3/lib/style.css'

import { loadGapiInsideDOM } from 'gapi-script'
// import { gapi } from 'gapi-script'
// window.gapi = gapi
// console.log(gapi)
async function setupApp() {
  // Load the global loading status
  const appLoading = createApp(AppLoading)
  appLoading.mount('#appLoading')

  // Create a Vue instance
  const app = createApp(AppVue)
  installPlugins(app) // Register Plugins
  await installPinia(app) // Registration module Pinia
  // app.use(store)
  await installRouter(app)// Register Module Vue-router
  // app.use(Vue3TouchEvents)
  app.use<Vue3TouchEventsOptions>(Vue3TouchEvents, {
    disableClick: false
    // any other global options...
  })

  //vant components
  app.use(Notify)
  app.use(Lazyload)
  app.use(ImagePreview)

  //i18n
  app.use(i18n)
  //PrimeVue
  // app.use(PrimeVue, {
  //   unstyled: true,
  //   pt: Aura                               //apply preset
  // })

  // Register plugins directive/static resource
  // Object.values(import.meta.glob<{ install: (app: App) => void }>('./plugins/*.ts', { eager: true })).map(i => app.use(i))

  // Unloading animation
  appLoading.unmount()

  // Mount
  app.mount('#app')
  await loadGapiInsideDOM()
}

setupApp()

// const app = createApp(App)
// app.use(i18n)
// app.use(store)
// app.use(router)

// app.mount('#app')
