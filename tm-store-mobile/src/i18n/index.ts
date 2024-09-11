import { createI18n } from 'vue-i18n'
// import { local } from '@/utils/storage'
import localStorage from '@/utils/localStorage'
const appStoreLanguage = localStorage.get('appStore.language')
const modulesFiles = import.meta.glob('./locales/*.json', { eager: true })
export const locales = Object.keys(modulesFiles).reduce((locales, currentValue) => {
  const moduleName = currentValue.replace('./locales/', '').replace(/\.\w+$/, '')
  locales[moduleName] = (modulesFiles[currentValue] as any).default
  return locales
}, {})

export const languages = Object.keys(locales).map(x => {
  return {
    label: locales[x].initial.title,
    order: locales[x].initial.order,
    value: x
  }
}).sort((a, b) => a.order - b.order)

export const i18n = createI18n({
  legacy: false,
  locale: appStoreLanguage || import.meta.env.VITE_APP_DEFAULT_LANG, // Default display language
  fallbackLocale: import.meta.env.VITE_APP_DEFAULT_LANG,
  messages: locales,
  // Missing internationalization key warning
  // missingWarn: false,

  // Missing fallback content warning
  fallbackWarn: false,
})

export function setLocale(locale: string) {
  i18n.global.locale.value = locale
}

export const $t = i18n.global.t

// export function install(app: App) {
//   app.use(i18n)
// }

//vant Locale
import { Locale } from 'vant';
import enUS from 'vant/es/locale/lang/en-US';
Locale.use('en-US', enUS);
// const currentLang = useCurrentLang();
// console.log(currentLang.value); // --> 'en-US'

