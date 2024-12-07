import { http } from '@/utils/http-axios'
import { ICreated, IMeta, IResponseList, IResponseItem, IResponseFlag } from './interfaces/common'

export interface IModelType {
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
  state: (): {
    keys: Array<string>
    all: IModelType[]
    items: IModelType[]
    rowsNumber: number
    // metaKeys: []
    // metaValues: []
    item: IModelType
  } => ({
    keys: [],
    all: [],
    items: [],
    rowsNumber: 0,
    item: JSON.parse(JSON.stringify(constant)),
  }),
  getters: {
    getByKey: (state) => {
      return (key) => state.all.filter(x => x.key == key).sort((a, b) => { return a.order - b.order })
    }
  },
  actions: {
    async getAll(arg?: any): Promise<IResponseList> {
      try {
        const rs: IResponseList = await http.axiosInstance.get(`/${API_PATH}/all`, { params: arg })
        this.all = rs.data.sort((a, b) => { return a.order - b.order }) as IModelType[]
        return rs
      } catch (e) { throw e }
    },
    async getItems(arg?: any): Promise<IResponseList> {
      try {
        const rs: IResponseList = await http.axiosInstance.get(`/${API_PATH}`, { params: arg })
        this.items = rs.data
        this.rowsNumber = rs.rowsNumber
        return rs
      } catch (e) { throw e }
    },
    async getItem(arg?: any): Promise<IResponseList> {
      try {
        const rs: IResponseList = await http.axiosInstance.get(`/${API_PATH}/${arg.id}`, { params: arg })
        this.item = rs.data
        return rs
      } catch (e) { throw e }
    },
    async getKey(arg?: any) {
      try {
        const rs = await http.axiosInstance.get(`/${API_PATH}/key`, { params: arg })
        if (!rs) return []
        this.keys = rs.data
        return rs
      } catch (e) { throw e }
    },
    async getMeta(arg?: any) {
      try {
        const rs = await http.axiosInstance.get(`/${API_PATH}/meta`, { params: arg })
        if (rs) return rs.data
        return []
      } catch (e) { throw e }
    },
    async create(arg?: any) {
      try {
        const rs: IResponseItem = await http.axiosInstance.post(`/${API_PATH}`, arg)
        if (rs.status) this.addItems(rs.data)
        return rs
      } catch (e) { throw e }
    },
    async update(arg?: any) {
      try {
        const rs: IResponseItem = await http.axiosInstance.put(`/${API_PATH}`, arg)
        if (rs.status) this.updateItems(rs.data)
        return rs
      } catch (e) { throw e }
    },
    async updateFlag(arg?: any) {
      try {
        const rs: IResponseFlag = await http.axiosInstance.patch(`/${API_PATH}`, arg)
        // if (rs.status) this.removeItems(rs.success)
        return rs
      } catch (e) { throw e }
    },
    async setItem(arg?: any) {
      this.item = arg ? { ...arg } : JSON.parse(JSON.stringify(constant))
    },
    async addItems(arg: any, items?: IModelType[]) {
      try {
        if (items) {
          if (Array.isArray(arg)) {
            this.items.concat(arg)
            this.all.concat(arg)
          }
          else {
            this.items.push(arg)
            this.all.push(arg)
          }
        } else {
          if (Array.isArray(arg)) {
            this.items.concat(arg)
            this.all.concat(arg)
          }
          else {
            this.items.push(arg)
            this.all.push(arg)
          }
        }
      } catch (e) { throw e }
    },
    async updateItems(arg: any, items?: IModelType[]) {
      try {
        if (Array.isArray(arg)) {
          arg.forEach(e => {
            if (items) {
              const i = items.findIndex(x => x._id === e._id)
              if (i > -1) items.splice(i, 1, e)
            } else {
              let i = this.items.findIndex(x => x._id === e._id)
              if (i > -1) this.items.splice(i, 1, e)
              i = this.all.findIndex(x => x._id === e._id)
              if (i > -1) this.all.splice(i, 1, e)
            }
          })
        } else {
          let i = this.items.findIndex(x => x._id === arg._id)
          if (i > -1) this.items.splice(i, 1, arg)
          i = this.all.findIndex(x => x._id === arg._id)
          if (i > -1) this.all.splice(i, 1, arg)
        }
      } catch (e) { throw e }
    },
    async removeItems(arg: any, items?: IModelType[]) {
      try {
        if (Array.isArray(arg)) {
          arg.forEach(e => {
            if (items) {
              let i = items.findIndex(x => x._id === e)
              if (i > -1) items.splice(i, 1)
            } else {
              let i = this.items.findIndex(x => x._id === e)
              if (i > -1) this.items.splice(i, 1)
              i = this.all.findIndex(x => x._id === e)
              if (i > -1) this.all.splice(i, 1)
            }
          })
        } else {
          if (items) {
            const i = items.findIndex(x => x._id === arg)
            if (i > -1) items.splice(i, 1)
          } else {
            let i = this.items.findIndex(x => x._id === arg)
            if (i > -1) this.items.splice(i, 1)
            i = this.all.findIndex(x => x._id === arg)
            if (i > -1) this.all.splice(i, 1)
          }
        }
      } catch (e) { throw e }
    },
    // easily reset state using `$reset`
    clear() {
      this.$reset()
    }
  }
})
