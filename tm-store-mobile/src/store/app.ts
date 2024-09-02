import { local } from '@/utils/storage'
import { setLocale } from '@/i18n'
export type TransitionAnimation = '' | 'fade-slide' | 'fade-bottom' | 'fade-scale' | 'zoom-fade' | 'zoom-out'
export type LayoutMode = 'leftMenu' | 'topMenu' | 'mixMenu'

const { VITE_APP_DEFAULT_LANG } = import.meta.env

const docEle = ref(document.documentElement)

const { isFullscreen, toggle } = useFullscreen(docEle)

const { system, store } = useColorMode({
  emitAuto: true,
})

export const useAppStore = defineStore('app-store', {
  persist: true,
  state: () => {
    return {
      darkMode: false,
      colorWeak: false,
      showLogo: true,
      showProgress: true,
      showBreadcrumb: true,
      showBreadcrumbIcon: true,
      showSetting: false,
      contentFullScreen: false,
      languages: [],
      language: VITE_APP_DEFAULT_LANG as string,
      transitionAnimation: 'fade-slide' as TransitionAnimation,
      loading: {
        get: false,
        post: false,
        put: false,
        patch: false,
        delete: false
      },
      routes: [],
      cacheRoutes: []
    }
  },
  getters: {
    storeColorMode() {
      return store.value
    },
    colorMode() {
      return store.value === 'auto' ? system.value : store.value
    },
    fullScreen() {
      return isFullscreen.value
    },
  },
  actions: {
    // Reset All Settings
    resetAlltheme() {
      this.primaryColor = '#18a058'
      this.collapsed = false
      this.grayMode = false
      this.colorWeak = false
      this.loadFlag = true
      this.showLogo = true
      this.showTabs = true
      this.showFooter = true
      this.showBreadcrumb = true
      this.showBreadcrumbIcon = true
      this.showWatermark = false
      this.transitionAnimation = 'fade-slide'
      this.layoutMode = 'leftMenu'
      this.contentFullScreen = false

      // Reset all colors
      this.setPrimaryColor(this.primaryColor)
    },
    setLanguage(lang) {//App.lang
      setLocale(lang)
      local.set('lang', lang)
      this.language = lang
    },
    setDarkMode() {
      this.darkMode = !this.darkMode
    },
    setColorMode(mode: 'light' | 'dark' | 'auto') {
      store.value = mode
    },
    /* Toggle sidebar collapse */
    toggleCollapse() {
      this.collapsed = !this.collapsed
    },
    /* Toggle full screen */
    toggleFullScreen() {
      toggle()
    },
    /**
     * @description: Page content reload
     * @param {number} delay - Delay in milliseconds
     * @return {*}
     */
    async reloadPage(delay = 600) {
      this.loadFlag = false
      await nextTick()
      if (delay) {
        setTimeout(() => {
          this.loadFlag = true
        }, delay)
      }
      else {
        this.loadFlag = true
      }
    },
    /* Switch to color blindness mode */
    toggleColorWeak() {
      docEle.value.classList.toggle('color-weak')
      this.colorWeak = docEle.value.classList.contains('color-weak')
    },
    /* Toggle Gray Mode */
    toggleGrayMode() {
      docEle.value.classList.toggle('gray-mode')
      this.grayMode = docEle.value.classList.contains('gray-mode')
    },
  }
})
