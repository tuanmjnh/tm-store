import { http } from '@/utils/http-axios'
import { router } from '@/router'
import { local } from '@/utils/storage'
import { IUser } from './interfaces/user'

interface AuthStatus {
  user: IUser | null
  routes: Array<string>
  token: string
}
const API_PATH = 'auth'
export const useAuthStore = defineStore('auth-store', {
  state: (): AuthStatus => {
    return {
      user: local.get('user'),
      routes: [],
      token: local.get('accessToken') || '',
    }
  },
  getters: {
    /** Are you logged in? */
    isLogin(state) {
      return Boolean(state.token)
    },
  },
  actions: {
    async verify(arg) {
      let rs = null
      try {
        // api.post(`/${NAMESPACED}`, arg).then(x => {
        //   console.log(x)
        // })
        if (arg) rs = await http.axiosInstance.post(`/${API_PATH}`, arg)
        else rs = await http.axiosInstance.get(`/${API_PATH}`, { arg } as any)
        console.log(rs)
        // if (rs) {
        //   if (rs.token) this.token = rs.token
        //   if (rs.user) {
        //     this.user = rs.user
        //     if (rs.user.routes) {
        //       const routes = await generateRoutes(rs.user.routes)
        //       for await (const r of routes) {
        //         Router.addRoute(r)
        //       }
        //       this.routes = routes
        //     }
        //   }
        // } else {
        //   this.token = null
        //   this.user = null
        //   this.routes = []
        //   resetRouter()
        // }
        return rs
      } catch (e) {
        console.log(e)
        return rs
      }
    },
    /* Log in and out, reset user information, etc. */
    async logout() {
      const route = unref(router.currentRoute)
      // Clear local cache
      this.clearAuthStorage()
      // Clear route, menu and other data
      // const routeStore = useRouteStore()
      // routeStore.resetRouteStore()
      // Reset current repository
      this.$reset()
      // Redirect to login page
      if (route.meta.requiresAuth) {
        router.push({
          name: 'login',
          query: {
            redirect: route.fullPath,
          },
        })
      }
    },
    clearAuthStorage() {
      local.remove('accessToken')
      local.remove('refreshToken')
      local.remove('userInfo')
    },

    /* User login */
    async login(userName: string, password: string) {
      try {
        // const { isSuccess, data } = await fetchLogin({ userName, password })
        // if (!isSuccess)
        //   return

        // Handling Login Information
        // await this.handleLoginInfo(data)
      }
      catch (e) {
        console.warn('[Login Error]:', e)
      }
    },

    /* Processing the data returned by login */
    async handleLoginInfo(data) {
      // Save token and userInfo
      local.set('userInfo', data)
      local.set('accessToken', data.accessToken)
      local.set('refreshToken', data.refreshToken)
      this.token = data.accessToken
      this.userInfo = data

      // Adding Routes and Menus
      // const routeStore = useRouteStore()
      // await routeStore.initAuthRoute()

      // Redirect jump
      const route = unref(router.currentRoute)
      const query = route.query as { redirect: string }
      router.push({
        path: query.redirect || '/',
      })
    },
  },
})
