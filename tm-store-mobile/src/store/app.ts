// import { local } from '@/utils/storage'
import { setLocale } from '@/i18n'
import moment from 'moment'
export type TransitionAnimation = '' | 'fade-slide' | 'fade-bottom' | 'fade-scale' | 'zoom-fade' | 'zoom-out'
export type LayoutMode = 'leftMenu' | 'topMenu' | 'mixMenu'

const { VITE_APP_DEFAULT_LANG } = import.meta.env

const docEle = ref(document.documentElement)

const { isFullscreen, toggle } = useFullscreen(docEle)

const { system, store } = useColorMode({
  emitAuto: true,
})
// these APIs are auto-imported from @vueuse/core
// export const isDark = useDark()
// export const toggleDark = useToggle(isDark)
// export const preferredDark = usePreferredDark()

interface IStateApp {
  darkMode: globalThis.WritableComputedRef<boolean>
  colorWeak: boolean
  showLogo: boolean
  showProgress: boolean
  showBreadcrumb: boolean
  showBreadcrumbIcon: boolean
  showSetting: boolean
  contentFullScreen: boolean
  filter: string
  isLeftMenu: boolean
  rowsPerPageOptions: Array<number>
  languages: Array<any>
  language: string
  transitionAnimation: TransitionAnimation
  loading: {
    get: boolean,
    post: boolean,
    put: boolean,
    patch: boolean,
    delete: boolean
  },
  routes: Array<any>
  cacheRoutes: Array<any>
  font: {
    size: number
    family: string
    color: string
    lineHeight: number
  },
  format: {
    date: string
    time: string
  },
  dialog: {
    add: boolean,
    edit: boolean,
    import: boolean
  },
  dense: {
    form: boolean,
    button: boolean,
    input: boolean,
    table: boolean,
    menu: boolean
  },
  shadow: {
    table: boolean
  }
}

const settings = {
  darkMode: false,
  language: 'vi-VN',
  unitPrice: 'vnd',
  font: {
    size: 14,
    family: '"Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif',
    color: '#6b6b6b',
    lineHeight: 1.5
  },
  format: {
    date: 'YYYY-MM-DD',
    time: 'hh:mm:ss A'
  },
  dialog: {
    add: true,
    edit: true,
    import: true
  },
  dense: {
    form: true,
    button: true,
    input: true,
    table: true,
    menu: false
  },
  shadow: {
    table: false
  },
  loading: {
    get: false,
    post: false,
    put: false,
    patch: false,
    delete: false
  },
}
export const useAppStore = defineStore('appStore', {
  persist: true,
  state: (): IStateApp => ({
    darkMode: isDark,
    colorWeak: false,
    showLogo: true,
    showProgress: true,
    showBreadcrumb: true,
    showBreadcrumbIcon: true,
    showSetting: false,
    contentFullScreen: false,
    filter: '',
    isLeftMenu: false,
    rowsPerPageOptions: [10, 20, 50, 100, 200, 0],
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
    cacheRoutes: [],
    font: {
      size: 14,
      family: '"Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif',
      color: '#6b6b6b',
      lineHeight: 1.5
    },
    format: {
      date: settings.format.date,
      time: settings.format.time
    },
    dialog: {
      add: true,
      edit: true,
      import: true
    },
    dense: {
      form: true,
      button: true,
      input: true,
      table: true,
      menu: false
    },
    shadow: {
      table: false
    }
  }),
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
    minDate() {
      return (val?: number): Date => {
        const now = new Date()
        now.setFullYear(now.getFullYear() - (val || 100))
        return now
      }
    },
    maxDate() {
      return (val?: number): Date => {
        const now = new Date()
        now.setFullYear(now.getFullYear() + (val || 0))
        return now
      }
    },
    formatDate(state) {
      return (val?: string | Date): string => {
        if (val) return moment(val).format(state.format.date)
        else return ''
      }
    },
    formatTime(state) {
      return (val?: string | Date): string => {
        if (val) return moment(val).format(state.format.time)
        else return ''
      }
    },
    formatDateTime(state) {
      return (val?: string | Date): string => {
        if (val) return moment(val).format(`${state.format.date} ${state.format.time}`)
        else return ''
      }
    },
    formatDateDefault() {
      return (val?: string | Date): string => {
        if (val) return moment(val).format(settings.format.date)
        else return ''
      }
    },
    formatTimeDefault() {
      return (val?: string | Date): string => {
        if (val) return moment(val).format(settings.format.time)
        else return ''
      }
    },
    formatDateToArray: () => {
      return (val?: string | Date): Array<string> => {
        if (val) return moment(val).format(settings.format.date).split('-')
        else return []
      }
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
      // local.set('lang', lang)
      this.language = lang
    },
    setColorMode(mode: 'light' | 'dark' | 'auto') {
      store.value = mode
    },
    toggleDarkMode() {
      toggleDark()
      // const toggleDark = useToggle(this.darkMode)
      // toggleDark()
      // useToggle(this.darkMode)
      // this.darkMode = !this.darkMode
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
    setLoading(method?: string) {
      if (method) this.loading[method] = true
      else this.loading = settings.loading
    },
    // easily reset state using `$reset`
    clear() {
      this.$reset()
    }
  }
})
