import { defineStore } from 'pinia'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// import MApp from './modules/app'
// export const useStoreApp = defineStore({
//   ...{ id: 'app', persist: true }, ...MApp
// })

// import MSetting from './modules/settings'
// export const useStoreSetting = defineStore({
//   ...{ id: 'settings', persist: true }, ...MSetting
// })

const modulesFiles = import.meta.glob(`./modules/*.js`, { eager: true })
// const modules = Object.keys(modulesFiles).reduce((modules, modulePath) => {
//   const moduleName = modulePath.replace(/^\.\/modules\/(.*)\.\w+$/, '$1')
//   modules[moduleName] = modulesFiles[modulePath].default
//   modules[moduleName].id = moduleName
//   modules[moduleName].persist = true
//   return defineStore(modules[moduleName])
// }, {})
// // console.log(modules())
// export { modules }
const defineStores = {}
Object.keys(modulesFiles).forEach(modulePath => {
  const moduleName = modulePath.replace(/^\.\/modules\/(.*)\.\w+$/, '$1')
  const modules = modulesFiles[modulePath].default
  // modules.id = moduleName
  // modules.persist = true
  // defineStores[`useStore${moduleName.charAt(0).toUpperCase()}${moduleName.slice(1)}`] = defineStore(modules)
  defineStores[moduleName] = defineStore(modules)
})

// console.log(MSetting.state())
// Install the store instance as a plugin
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// console.log(pinia)
export { pinia }
export default defineStores
