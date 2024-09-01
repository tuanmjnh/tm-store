import Cookies from 'js-cookie'
import { api } from '../../plugins/axios'
import { setI18nLanguage } from '../../i18n'
import localStorage from '../../utils/localStorage'
const NAMESPACED = 'setting'
// const COOKIE_DATA = Cookies.get(NAMESPACED) ? JSON.parse(Cookies.get(NAMESPACED)) : {}
const LOCALSTORAGE = localStorage.get(NAMESPACED) || {}
const CONSTANT = {
  darkMode: false,
  language: 'vi-VN',//'en-US',
  unitPrice: 'vnd',
  font: {
    size: 14,
    family: '"Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif',
    color: '#6b6b6b',
    lineHeight: 1.5
  },
  format: {
    date: 'DD/MM/YYYY',
    time: 'hh:mm:ss a',
    dateTime: {
      date: 'DD/MM/YYYY',
      time: 'hh:mm:ss a'
    }
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
}

const INITIALIZE = (state) => {
  // if (data) state = { ...state, ...data }
  if (state.darkMode) {
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.className = 'van-theme-dark'
  }
  else {
    document.documentElement.setAttribute('data-theme', 'light')
    document.documentElement.className = 'van-theme-light'
  }
  document.body.style.fontSize = `${state.font.size}px`
  document.body.style.fontFamily = state.font.family
  document.body.style.color = state.font.color
  document.body.style.lineHeight = state.font.lineHeight
  setI18nLanguage(state.language)
  localStorage.set(NAMESPACED, state)
}

export default {
  id: NAMESPACED,
  persist: true,
  state: () => ({
    darkMode: LOCALSTORAGE.darkMode || CONSTANT.darkMode,
    language: LOCALSTORAGE.language && LOCALSTORAGE.language != 'undefined-undefined' && LOCALSTORAGE.language != 'undefined' ? LOCALSTORAGE.language : CONSTANT.language,
    unitPrice: LOCALSTORAGE.unitPrice || CONSTANT.unitPrice,
    font: {
      size: LOCALSTORAGE.font && LOCALSTORAGE.font.size ? LOCALSTORAGE.font.size : CONSTANT.font.size,
      family: LOCALSTORAGE.font && LOCALSTORAGE.font.family ? LOCALSTORAGE.font.family : CONSTANT.font.family,
      color: LOCALSTORAGE.font && LOCALSTORAGE.font.color ? LOCALSTORAGE.font.color : CONSTANT.font.color,
      lineHeight: LOCALSTORAGE.lineHeight && LOCALSTORAGE.font.lineHeight ? parseFloat(LOCALSTORAGE.font.lineHeight) : CONSTANT.font.lineHeight
    },
    format: {
      date: LOCALSTORAGE.format && LOCALSTORAGE.format.date ? LOCALSTORAGE.format.date : CONSTANT.format.date,
      time: LOCALSTORAGE.format && LOCALSTORAGE.format.time ? LOCALSTORAGE.format.time : CONSTANT.format.time,
      dateTime: LOCALSTORAGE.format && LOCALSTORAGE.format.dateTime ? LOCALSTORAGE.format.dateTime : CONSTANT.format.dateTime,
    },
    dialog: {
      add: LOCALSTORAGE.dialog && LOCALSTORAGE.dialog.add !== undefined ? LOCALSTORAGE.dialog.add : CONSTANT.dialog.add,
      edit: LOCALSTORAGE.dialog && LOCALSTORAGE.dialog.edit !== undefined ? LOCALSTORAGE.dialog.edit : CONSTANT.dialog.edit,
      import: LOCALSTORAGE.dialog && LOCALSTORAGE.dialog.import !== undefined ? LOCALSTORAGE.dialog.import : CONSTANT.dialog.import
    },
    dense: {
      form: LOCALSTORAGE.dense && LOCALSTORAGE.dense.form !== undefined ? LOCALSTORAGE.dense.form : CONSTANT.dense.form,
      button: LOCALSTORAGE.dense && LOCALSTORAGE.dense.button !== undefined ? LOCALSTORAGE.dense.button : CONSTANT.dense.button,
      input: LOCALSTORAGE.dense && LOCALSTORAGE.dense.input !== undefined ? LOCALSTORAGE.dense.input : CONSTANT.dense.input,
      table: LOCALSTORAGE.dense && LOCALSTORAGE.dense.table !== undefined ? LOCALSTORAGE.dense.table : CONSTANT.dense.table,
      menu: LOCALSTORAGE.dense && LOCALSTORAGE.dense.menu !== undefined ? LOCALSTORAGE.dense.menu : CONSTANT.dense.menu
    },
    shadow: {
      table: LOCALSTORAGE.shadow && LOCALSTORAGE.shadow.table !== undefined ? LOCALSTORAGE.shadow.table : CONSTANT.shadow.table
    }
  }),
  getters: {},
  actions: {
    get(arg) {
      return api.get(`/${NAMESPACED}`, { arg }).then((res) => {
        if ((typeof rs === 'object' || rs instanceof Object) && Object.keys(rs).length) {
          INITIALIZE(this.$state, rs)
        }
      })
    },
    set(arg) {
      if (arg) {
        if (arg.darkMode) {
          this.darkMode = arg.darkMode ? true : false
        }
        if (arg.language && arg.language != 'undefined-undefined' && arg.language != 'undefined') this.language = arg.language
        if (arg.unitPrice) this.unitPrice = arg.unitPrice

        if (arg.font)
          if (arg.font.key === 'size') {
            this.font.size = parseInt(arg.font.value)
            document.body.style.fontSize = `${this.font.size}px`
          } else if (arg.font.key === 'family') {
            this.font.family = arg.font.value
            document.body.style.fontFamily = this.font.family
          } else if (arg.font.key === 'color') {
            this.font.color = arg.font.value
            document.body.style.color = this.font.color
          } else if (arg.font.key === 'lineHeight') {
            this.font.lineHeight = arg.font.value
            document.body.style.lineHeight = this.font.lineHeight
          }

        if (arg.format) this.format = { ...this.format, ...arg.format }
        if (arg.dense) this.dense = { ...this.dense, ...arg.dense }
        if (arg.shadow) this.shadow = { ...this.shadow, ...arg.shadow }
        INITIALIZE(this.$state)
        if (Cookies.get('token')) api.post(`/${NAMESPACED}`, arg)
      } else {
        INITIALIZE(this.$state)
        if (Cookies.get('token')) api.post(`/${NAMESPACED}`, this.$state)
      }
    },
    setDarkMode(arg) {
      this.$patch((state) => {
        if (arg != undefined) state.darkMode = arg
        // if (state.darkMode) {
        //   document.documentElement.setAttribute('data-theme', 'dark')
        //   document.documentElement.className = 'van-theme-dark'
        // }
        // else {
        //   document.documentElement.setAttribute('data-theme', 'light')
        //   document.documentElement.className = 'van-theme-light'
        // }
        INITIALIZE(state)
      })
    },
    setLanguage(arg) {
      this.$patch((state) => {
        if (arg && arg != 'undefined-undefined' && arg != 'undefined') state.language = arg
        INITIALIZE(state)
      })
    },
    setUnitPrice(arg) {
      this.$patch((state) => {
        if (arg && arg != 'undefined') state.unitPrice = arg
        INITIALIZE(state)
      })
    },
    setFont(arg) {
      this.$patch((state) => {
        if (arg && arg != 'undefined')
          if (arg.key === 'size') {
            state.font.size = parseInt(arg.value)
          } else if (arg.font.key === 'family') {
            state.font.family = arg.value
          } else if (arg.font.key === 'color') {
            state.font.color = arg.value
          } else if (arg.font.key === 'lineHeight') {
            state.font.lineHeight = arg.value
          }
        INITIALIZE(state)
      })
    },
    setFormat(arg) {
      this.$patch((state) => {
        if (arg && arg != 'undefined') state.format = { ...state.format, ...arg }
        INITIALIZE(state)
      })
    },
    setDense(arg) {
      this.$patch((state) => {
        if (arg && arg != 'undefined') state.dense = { ...state.dense, ...arg }
        INITIALIZE(state)
      })
    },
    setShadow(arg) {
      this.$patch((state) => {
        if (arg && arg != 'undefined') state.shadow = { ...state.shadow, ...arg }
        INITIALIZE(state)
      })
    },
    reload() {
      const data = LOCALSTORAGE.get(COOKIE_NAME)
      INITIALIZE(data)
    },
    initialize() {
      INITIALIZE(this.$state)
    },
    clear() {
      this.$reset()
    }
  }
}