import { http } from '@/utils/http-axios'
import { ICreated, IResponseList, IResponseItem, IResponseFlag, IMeta, IProductType, IProductTypeData } from './interfaces/common'
import { IGoogleFile } from '@/services/google/drive-gapi'
export interface IModelProduct {
  _id?: string
  code: string
  groups: Array<string>
  title: string
  desc: string
  content: string
  types: Array<IProductType>
  typeData: IProductTypeData
  quantity: number
  price: number
  priceImport: number
  priceExport: number
  unit: string
  brand: string
  originName: string
  originAddress: string
  weight: number
  date: string
  pins: Array<string>
  tags: Array<string>
  attr: Array<IMeta>
  meta: Array<IMeta>
  images: Array<IGoogleFile>
  attach: Array<IGoogleFile>
  qrcode: string
  barcode: string
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
  types: null,
  typeData: null,
  quantity: null,
  price: null,
  priceImport: null,
  priceExport: null,
  unit: null,
  brand: null,
  originName: null,
  originAddress: null,
  weight: null,
  date: null,
  pins: null,
  tags: null,
  attr: null,
  meta: null,
  images: null,
  attach: null,
  qrcode: null,
  barcode: null,
  order: 1,
  flag: 1,
  created: { at: null, by: null, ip: null }
}

const API_PATH = 'products'
export const useProductStore = defineStore('productStore', {
  persist: false,
  state: (): {
    items: IModelProduct[]
    item: IModelProduct
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
        this.all = rs.data as IModelProduct[]
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
    async addItems(arg: any, items?: IModelProduct[]) {
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
    async updateItems(arg: any, items?: IModelProduct[]) {
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
    async removeItems(arg: any, items?: IModelProduct[]) {
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
