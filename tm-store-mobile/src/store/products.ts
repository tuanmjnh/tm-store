import { http } from '@/utils/http-axios'
import { ICreated, IResponseList, IResponseItem, IResponseFlag, IMeta } from './interfaces/common'
import { IProductType, IProductTypeOption, IProductTypeData } from './interfaces/product'
import { IGoogleFile } from '@/services/google/drive-gapi'
export interface IModelProduct {
  _id?: string
  code: string
  groups: Array<string>
  title: string
  desc: string
  content: string
  types: Array<IProductType>
  typeData: Object
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
    typeData: IProductTypeData
    // metaKeys: []
    // metaValues: []
  } => ({
    items: [],
    item: JSON.parse(JSON.stringify(constant)),
    typeData: {
      price: 0,
      priceImport: 0,
      quantity: 0
    }
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
        const params = { ...{}, ...arg }
        if (params.groups && params.groups.length) params.groups = JSON.stringify(params.groups)
        const rs: IResponseList = await http.axiosInstance.get(`/${API_PATH}`, { params: params })
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
    //Types
    generatorIdType(options: IProductTypeOption[]) {
      const ids = options.map(x => x.id)
      return ids.max() + 1
    },
    addTypeGroup(types: IProductType[], typeLabel?: string, optionLabel?: string) {
      if (!types) types = []
      const option: IProductTypeOption = { id: 1, label: optionLabel }
      types.push({ label: typeLabel, options: [option] })
      return { types, option }
    },
    removeTypeGroup(types: IProductType[], indexGroup: number) {
      types.splice(indexGroup, 1)
      if (types.length < 1) types = null
      return types
    },
    addTypeOption(options: IProductTypeOption[], optionLabel?: string) {
      const option = { id: this.generatorIdType(options), label: optionLabel }
      options.push(option)
      return { options, option }
    },
    removeTypeOption(options: IProductTypeOption[], optionId: number) {
      const index = options.findIndex(x => x.id === optionId)
      if (index > -1) options.splice(index, 1)
      return options
    },
    pushTypeDataOption(types: IProductType[], typeData?: IProductTypeData, indexGroup?: number, option?: IProductTypeOption) {
      if (!typeData) typeData = { price: 0, priceImport: 0, quantity: 0 } as IProductTypeData
      if (indexGroup === 0) {
        if (types.length === 1) {
          typeData[option.id] = this.typeData
        } else {
          typeData[option.id] = {}
          for (let i = 0; i < types[1].options.length; i++) {
            typeData[option.id][types[1].options[i].id] = this.typeData
          }
        }
      } else {
        // Check first push type 2
        if (types[1].options.length === 1) {
          const cloneTypeData = {} as IProductTypeData
          for (const e in typeData) {
            cloneTypeData[e] = {}
            // cloneTypeData[e][option.id] = Object.keys(typeData[e]).length ? new TypeData(typeData[e].price, typeData[e].priceImport, typeData[e].quantity) : new TypeData()// Object.keys(typeData[e]).length ? { ...typeData[e] } : new TypeData()
            cloneTypeData[e][option.id] = Object.keys(typeData[e]).length ? { ...{}, ...typeData[e] } : { ...{}, ...this.TypeData }
          }
          typeData = cloneTypeData
        } else {
          for (const e in typeData) {
            typeData[e][option.id] = this.typeData
          }
        }
      }
      return typeData
    },
    removeTypeDataGroup(types: IProductType[], typeData: IProductTypeData, indexGroup: number) {
      if (!types || types.length < 1) return null
      if (indexGroup === 0) {
        return Object.values(typeData)[0]
      } else {
        const cloneTypeData = {}
        for (const e in typeData) {
          const item = Object.values(typeData[e]) as Array<any>
          cloneTypeData[e] = { ...item[0] }
        }
        return cloneTypeData
      }
    },
    removeTypeDataOption(typeData: IProductTypeData, indexGroup: number, optionId: number) {
      if (indexGroup === 0) {
        delete typeData[optionId]
      } else {
        for (const e in typeData) {
          delete typeData[e][optionId]
        }
      }
      return typeData
    },
    async updateAllTypeData(types: IProductType[], typeData: Object, quickConfig: IProductTypeData) {
      if (types.length < 2) {
        for (const e in typeData) {
          typeData[e].price = quickConfig.price ? quickConfig.price : typeData[e].price
          typeData[e].priceImport = quickConfig.priceImport ? quickConfig.priceImport : typeData[e].priceImport
          typeData[e].quantity = quickConfig.quantity ? quickConfig.quantity : typeData[e].quantity
        }
      } else {
        for (const e in typeData) {
          for (const p in typeData[e]) {
            typeData[e][p].price = quickConfig.price ? quickConfig.price : typeData[e][p].price
            typeData[e][p].priceImport = quickConfig.priceImport ? quickConfig.priceImport : typeData[e][p].priceImport
            typeData[e][p].quantity = quickConfig.quantity ? quickConfig.quantity : typeData[e][p].quantity
          }
        }
      }
      return typeData
    },
    generateTypes(item: IModelProduct) {
      const rs = []
      if (item.types && item.types.length && item.typeData) {
        if (item.types.length === 1) {
          item.types[0].options.forEach(e => {
            rs.push({ ...{ type1: item.types[0].label, label1: e.label }, ...item.typeData[e.id] })
          })
        } else if (item.types.length === 2) {
          item.types[0].options.forEach(e => {
            item.types[1].options.forEach(ee => {
              rs.push({ ...{ type1: item.types[0].label, type2: item.types[1].label, label1: e.label, label2: ee.label }, ...item.typeData[e.id][ee.id] })
            })
          })
        }
      } else rs.push({ quantity: item.quantity, price: item.price, priceImport: item.priceImport })
      return rs
    },
    getValueTypeData(item: IModelProduct, key: string): Array<number> {
      const rs = [] as Array<number>
      if (item.types.length == 1) {
        for (const e in item.typeData) {
          rs.push(item.typeData[e][key])
        }
      } else if (item.types.length == 2) {
        for (const e in item.typeData) {
          for (const p in item.typeData[e]) {
            rs.push(item.typeData[e][p][key])
          }
        }
      } else {
        rs.push(item[key])
      }
      return rs
    },
    getValueTypeDataMinMax(item: IModelProduct, key: string, join?: string, format?: boolean) {
      const rs = this.getValueTypeData(item, key)
      if (join) return [format ? rs.min().format() : rs.min(), format ? rs.max().format() : rs.max()].join(join)
      else return [format ? rs.min().format() : rs.min(), format ? rs.max().format() : rs.max()]
    },
    getValueType(item: IModelProduct, key: string, join?: string, format?: boolean) {
      if (item.types && item.types.length)
        return this.getValueTypeDataMinMax(item, key, join, format)
      else
        return item[key] ? item[key].format() : '0'
    },
    // easily reset state using `$reset`
    clear() {
      this.$reset()
    }
  }
})
