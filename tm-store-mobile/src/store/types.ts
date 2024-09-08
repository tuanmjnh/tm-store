import { http } from '@/utils/http-axios'
import { router } from '@/router'
import { local } from '@/utils/storage'
import { ICreated, IMeta } from './interfaces/common'

interface IType {
  _id?: string
  key: string
  code: string
  name: string
  desc: string
  meta: Array<IMeta>
  order: number
  flag: number
  created: ICreated
}

interface IState {
  all: IType[],
  items: IType[],
  keys: [],
  // metaKeys: [],
  // metaValues: [],
  item: IType,
}

const constant = {
  _id: null,
  key: null,
  code: null,
  name: null,
  desc: null,
  meta: null,
  order: 1,
  flag: 1,
  created: { at: null, by: null, ip: null }
}

const API_PATH = 'types'
export const useTypeStore = defineStore('typeStore', {
  persist: true,
  state: (): IState => ({
    all: [],
    items: [],
    keys: [],
    item: { ...constant },
  }),
  getters: {
    // /** Are you logged in? */
    // isLogin(state) {
    //   return Boolean(state.accessToken)
    // },
  },
  actions: {
    async getAll(arg?: any) {
      try {
        const rs = await http.axiosInstance.get(`/${API_PATH}`, { params: arg })
        if (rs) return rs.data.sort(function (a, b) { return a.order - b.order })
        return []
      } catch (e) {
        // console.log(e)
        return []
      }
    },
    async getKey(arg?: any) {
      try {
        const rs = await http.axiosInstance.get(`/${API_PATH}/key`, { params: arg })
        if (rs) return rs.data
        return []
      } catch (e) {
        // console.log(e)
        return []
      }
    },
    async getMeta(arg?: any) {
      try {
        const rs = await http.axiosInstance.get(`/${API_PATH}/meta`, { params: arg })
        if (rs) return rs.data
        return []
      } catch (e) {
        // console.log(e)
        return []
      }
    },
    async create(arg?: any) {
      try {
        const rs = await http.axiosInstance.post(`/${API_PATH}/meta`, arg)
        if (rs) return rs.data
        return null
      } catch (e) {
        // console.log(e)
        return []
      }
    },
    async update(arg?: any) {
      try {
        const rs = await http.axiosInstance.get(`/${API_PATH}/meta`, arg)
        if (rs) return rs.data
        return null
      } catch (e) {
        // console.log(e)
        return []
      }
    },
    async updateFlag(arg?: any) {
      try {
        const rs = await http.axiosInstance.get(`/${API_PATH}/meta`, arg)
        if (rs) return rs.data
        return []
      } catch (e) {
        // console.log(e)
        return []
      }
    },
    // easily reset state using `$reset`
    clear() {
      this.$reset()
    }
  }
})
