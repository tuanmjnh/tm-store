import { http } from '@/utils/http-axios'
import { ICreated, IMeta, IResponseList } from './interfaces/common'

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
  // items: IType[],
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
    // items: [],
    keys: [],
    item: JSON.parse(JSON.stringify(constant)),
  }),
  getters: {
    // /** Are you logged in? */
    // isLogin(state) {
    //   return Boolean(state.accessToken)
    // },
  },
  actions: {
    async getAll(arg?: any): Promise<IResponseList> {
      try {
        const rs: IResponseList = await http.axiosInstance.get(`/${API_PATH}/all`, { params: arg })
        this.all = rs.data as IType[]
        return rs
      } catch (e) {
        // console.log(e)
        return { data: [], rowsNumber: 0 } as IResponseList
      }
    },
    async getItems(arg?: any): Promise<IResponseList> {
      try {
        const rs: IResponseList = await http.axiosInstance.get(`/${API_PATH}`, { params: arg })
        return rs
      } catch (e) {
        // console.log(e)
        return { data: [], rowsNumber: 0 } as IResponseList
      }
    },
    async getKey(arg?: any) {
      try {
        const rs = await http.axiosInstance.get(`/${API_PATH}/key`, { params: arg })
        if (!rs) return []
        this.keys = rs.data
        return rs.data
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
        const rs = await http.axiosInstance.post(`/${API_PATH}`, arg)
        if (rs) return rs.data
        return null
      } catch (e) {
        // console.log(e)
        return []
      }
    },
    async update(arg?: any) {
      try {
        const rs = await http.axiosInstance.put(`/${API_PATH}`, arg)
        if (rs) return rs.data
        return null
      } catch (e) {
        // console.log(e)
        return []
      }
    },
    async updateFlag(arg?: any) {
      try {
        const rs = await http.axiosInstance.patch(`/${API_PATH}`, arg)
        if (rs) return rs.data
        return []
      } catch (e) {
        // console.log(e)
        return []
      }
    },
    async setItem(arg?: any) {
      this.item = arg ? { ...arg } : JSON.parse(JSON.stringify(constant))
    },
    async addItems(arg: any) {
      if (Array.isArray(arg)) this.items.concat(arg)
      else this.items.push(arg)
    },
    async updateItems(arg: any) {
      if (Array.isArray(arg)) {
        arg.forEach(e => {
          const i = this.items.findIndex(x => x._id === e._id)
          if (i > -1) this.items.splice(i, 1, e)
        })
      } else {
        const i = this.items.findIndex(x => x._id === arg._id)
        if (i > -1) this.items.splice(i, 1, arg)
      }
    },
    async removeItems(arg: any) {
      if (Array.isArray(arg)) {
        arg.forEach(e => {
          const i = this.items.findIndex(x => x._id === e)
          if (i > -1) this.items.splice(i, 1)
        })
      } else {
        const i = this.items.findIndex(x => x._id === arg)
        if (i > -1) this.items.splice(i, 1)
      }
    },
    // easily reset state using `$reset`
    clear() {
      this.$reset()
    }
  }
})
