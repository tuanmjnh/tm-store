/* Stores the database entity table type, the specific content is in ./entities */
import moment from 'moment'
import { $t } from '../utils'
import { showNotify } from 'vant'
import type { Router } from 'vue-router'
declare namespace Entity {
}

/* The data types returned by various interfaces are as follows: ./api */
declare namespace Api {

}

declare global {
  // const $moment: any
  const googleTokenClient: any
  interface Window {
    history: any
    onGapiLoad: any
    onGisLoad: any
    gapi: typeof gapi
    google: typeof google
    googleTokenClient: any
    $loadingBar: import('van').LoadingBarApi
    $dialog: import('naive-ui').DialogApi
    $message: import('naive-ui').MessageApi
    $notify: typeof showNotify
  }
}
declare const history: any
declare const AMap: any
declare const BMap: any

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: typeof $t
    $moment: typeof moment
    $router: Router
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent
  export default component
}

declare namespace VantUI {
  type ThemeColor = 'default' | 'error' | 'primary' | 'info' | 'success' | 'warning'
}

declare namespace Storage {
  interface Session {
    dict: DictMap
  }

  interface Local {
    /* Storing user information */
    user: Info
    /* Storing access tokens */
    accessToken: string
    /* Storage refresh token */
    refreshToken: string
    /* Store login account */
    loginAccount: any
    /* Store current language */
    lang: App.lang
  }
}

declare namespace App {
  type lang = 'enUS' | 'viVN' | 'zhCN'
}

interface DictMap {
  [key: string]: Entity.Dict[]
}