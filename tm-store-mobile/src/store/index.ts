import type { App } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export * from './app'
export * from './auth'
export * from './connects'
export * from './types'
export * from './roles'
export * from './users'
export * from './groups'
export * from './news'
export * from './products'
// export * from './tab'

// const store = createPinia();
// store.use(piniaPluginPersistedstate)
// export { store };

// Install the pinia global state library
export function installPinia(app: App) {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
}