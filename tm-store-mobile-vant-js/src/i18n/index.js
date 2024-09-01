import { createI18n } from 'vue-i18n'
import Cookies from 'js-cookie'
import regionConstant from './region'
const defaultLanguage = 'vi-VN'
// const settings = Cookies.get('settings') ? JSON.parse(Cookies.get('settings')) : null
let i18n = null

// import js locales
// https://webpack.js.org/guides/dependency-management/#requirecontext
// const localesFiles = require.context('../i18n/locales', true, /\.js$/)
// const locales = localesFiles.keys().reduce((locales, modulePath) => {
//   const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
//   const value = localesFiles(modulePath)
//   locales[moduleName] = value.default
//   return locales
// }, {})

// const modules = import.meta.glob('../i18n/locales/*.js')
// for (const path in modules) {
//   modules[path]().then((mod) => {
//     // console.log(mod.default)
//     const moduleName = path.replace('../i18n/locales/', '').replace(/\.\w+$/, '')
//     console.log(mod)
//   })
// }
const modulesFiles = import.meta.glob('./locales/*.js', { eager: true })
const locales = Object.keys(modulesFiles).reduce((locales, modulePath) => {
  const moduleName = modulePath.replace('./locales/', '').replace(/\.\w+$/, '')
  // const value = modules[path]
  // locales[moduleName] = value.default
  locales[moduleName] = modulesFiles[modulePath].default
  return locales
}, {})

// import json locales
// export async function loadLocaleMessages (i18n, locale) {
//   // load locale messages with dynamic import
//   const messages = await import(
//     `../i18n/locales/${locale}.json` /* webpackChunkName: "locale-[request]" */
//   )

//   // set locale and locale message
//   i18n.global.setLocaleMessage(locale, messages.default)

//   return nextTick()
// }

const Get = () => {
  if (settings) return settings.language
  else {
    // if has not choose language
    const language = (navigator.language || navigator.browserLanguage).toLowerCase()
    const _locales = Object.keys(locales)
    for (const locale of _locales) {
      if (language.indexOf(locale) > -1) return locale
    }
    return 'vi-VN'
  }
}

const Set = (language) => {
  Cookies.set('language', language)
}

const GetAll = () => {
  const _locales = Object.keys(locales)
  return regionConstant.filter(x => _locales.indexOf(`${x.cc_iso}-${x.cc}`) > -1).sort((a, b) => b.id - a.id)
}

// export function setupI18n (options = { locale: defaultLanguage }) {
//   const i18n = createI18n(options)
//   setI18nLanguage(i18n, options.locale)
//   return i18n
// }

// export const i18n = setupI18n({
//   globalInjection: true,
//   // legacy: false,
//   // locale: 'vi-VN',
//   // fallbackLocale: 'vi-VN',
//   messages: locales
// })

const setI18nLanguage = (locale) => {
  if (i18n.mode === 'legacy') i18n.global.locale = locale
  else i18n.global.locale.value = locale
  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector('html').setAttribute('lang', locale)
}

const Init = (locale) => {
  i18n = createI18n({
    globalInjection: true,
    legacy: false,
    // locale: locale,
    locale: locale,
    fallbackLocale: locale,
    messages: locales
  })

  document.querySelector('html').setAttribute('lang', locale)
  return i18n
}
// const i18n = () => {
// if (settings && settings.language) Init(settings.language)
// else Init(defaultLanguage)
Init(defaultLanguage)
// console.log(i18n)
// console.log(i18n.global.messages)
// export default boot(({ app }) => {
//   // Set i18n instance on app
//   app.use(i18n)
// })

export { i18n, Get, Set, GetAll, setI18nLanguage, regionConstant }
