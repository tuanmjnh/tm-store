import { http } from '@/utils/http-axios'
import { ICreated, IResponseList, IResponseItem, IResponseFlag, IMeta } from './interfaces/common'
import { IGoogleFile } from '@/services/google/drive-gapi'
export interface IModelNews {
  _id?: string
  code: string
  groups: Array<string>
  title: string
  desc: string
  content: string
  url: string
  author: string
  date: Date
  pins: Array<string>
  tags: Array<string>
  attr: Array<IMeta>
  meta: Array<IMeta>
  images: Array<IGoogleFile>
  attach: Array<IGoogleFile>
  startAt: Date
  endAt: Date
  order: number
  flag: number
  created: ICreated
}

const constant = {
  code: null,
  groups: null,
  title: null,
  desc: null,
  content: null,
  url: null,
  author: null,
  date: null,
  pins: null,
  tags: null,
  attr: null,
  meta: null,
  images: null,
  attach: null,
  startAt: null,
  endAt: null,
  order: 1,
  flag: 1,
  created: { at: null, by: null, ip: null }
}

const API_PATH = 'news'
export const useNewsStore = defineStore('newsStore', {
  persist: false,
  state: (): {
    items: IModelNews[]
    item: IModelNews
    // metaKeys: []
    // metaValues: []
  } => ({
    items: [],
    item: JSON.parse(JSON.stringify(constant)),
  }),
  getters: {
  },
  actions: {
    async getAll(arg?: any): Promise<IResponseList> {
      try {
        const rs: IResponseList = await http.axiosInstance.get(`/${API_PATH}/all`, { params: arg })
        this.all = rs.data as IModelNews[]
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
    async create(arg?: any) {
      try {
        const rs: IResponseItem = await http.axiosInstance.post(`/${API_PATH}`, arg)
        return rs
      } catch (e) { throw e }
    },
    async update(arg?: any) {
      try {
        const rs: IResponseItem = await http.axiosInstance.put(`/${API_PATH}`, arg)
        return rs
      } catch (e) { throw e }
    },
    async updateFlag(arg?: any) {
      try {
        const rs: IResponseFlag = await http.axiosInstance.patch(`/${API_PATH}`, arg)
        return rs
      } catch (e) { throw e }
    },
    async setItem(arg?: any) {
      this.item = arg ? { ...arg } : JSON.parse(JSON.stringify(constant))
    },
    async addItems(arg: any, items?: IModelNews[]) {
      try {
        if (items) {
          if (Array.isArray(arg)) this.items.concat(arg)
          else this.items.push(arg)
        } else {
          if (Array.isArray(arg)) this.items.concat(arg)
          else this.items.push(arg)
        }
      } catch (e) { throw e }
    },
    async updateItems(arg: any, items?: IModelNews[]) {
      try {
        if (Array.isArray(arg)) {
          arg.forEach(e => {
            if (items) {
              const i = items.findIndex(x => x._id === e._id)
              if (i > -1) items.splice(i, 1, e)
            } else {
              const i = this.items.findIndex(x => x._id === e._id)
              if (i > -1) this.items.splice(i, 1, e)
            }
          })
        } else {
          const i = this.items.findIndex(x => x._id === arg._id)
          if (i > -1) this.items.splice(i, 1, arg)
        }
      } catch (e) { throw e }
    },
    async removeItems(arg: any, items?: IModelNews[]) {
      try {
        if (Array.isArray(arg)) {
          arg.forEach(e => {
            if (items) {
              const i = items.findIndex(x => x._id === e)
              if (i > -1) items.splice(i, 1)
            } else {
              const i = this.items.findIndex(x => x._id === e)
              if (i > -1) this.items.splice(i, 1)
            }
          })
        } else {
          if (items) {
            const i = items.findIndex(x => x._id === arg)
            if (i > -1) items.splice(i, 1)
          } else {
            const i = this.items.findIndex(x => x._id === arg)
            if (i > -1) this.items.splice(i, 1)
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
