import { createStore, createLogger } from 'vuex'
import getters from './getters'

const debug = process.env.NODE_ENV !== 'production'

// import example from './module-example'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 *
 * The function below can be async too either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */
/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */
const modulesFiles = import.meta.globEager(`./modules/*.js`)//, { import: 'default', eager: true }

// for (const path in modulesFiles) {
//   modulesFiles[path]().then((mod) => {
//     console.log(path, mod)
//   })
// }
// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = Object.keys(modulesFiles).reduce((modules, modulePath) => {

  // const moduleName = modulePath.replace('./modules/', '').replace(/\.\w+$/, '')
  const moduleName = modulePath.replace(/^\.\/modules\/(.*)\.\w+$/, '$1')

  // const a = new RegExp(/^\.\/modules\/(.*)\.\w+$/)
  // console.log(a.exec(modulePath))
  const value = modulesFiles[modulePath]

  modules[moduleName] = value.default

  return modules
}, {})
console.log(modules)


// const modules = import.meta.glob(`./modules/*.js`, { import: 'default' })


// export default store(function (/* { ssrContext } */) {
//   const Store = createStore({
//     modules: {
//       // example
//     },

//     // enable strict mode (adds overhead!)
//     // for dev mode and --debug builds only
//     strict: process.env.DEBUGGING,
//   })

//   return Store
// })

export default createStore({
  modules,
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
