import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export * from './app'
export * from './auth'
// export * from './router'
// export * from './tab'

const store = createPinia();
store.use(piniaPluginPersistedstate)
export { store };
