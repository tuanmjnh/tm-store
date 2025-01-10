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
export interface IProductFilter {
  text: string
  groups: Array<string>
  flag: number
  page: number
  rowsPerPage: number
}

const constant = {
  code: null,
  groups: [],
  title: null,
  desc: null,
  content: '',
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
    filter: IProductFilter
    // metaKeys: []
    // metaValues: []
  } => ({
    items: [],
    item: JSON.parse(JSON.stringify(constant)),
    typeData: {
      price: 0,
      priceImport: 0,
      quantity: 0
    },
    filter: {
      text: '',
      groups: [],
      flag: 1,
      page: 1,
      rowsPerPage: 15
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
        if (!arg.concat) this.items = rs.data
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
    async find(arg?: any): Promise<IResponseItem> {
      try {
        const rs: IResponseItem = await http.axiosInstance.get(`/${API_PATH}/find`, { params: arg })
        this.item = rs.data
        return rs
      } catch (e) { throw e }
    },
    async create(arg?: any) {
      try {
        const rs: IResponseItem = await http.axiosInstance.post(`/${API_PATH}`, arg)
        if (rs.status) this.addItems(rs.data)
        return rs
      } catch (e) { throw e }
    },
    async duplicate(arg?: any) {
      try {
        const rs: IResponseItem = await http.axiosInstance.post(`/${API_PATH}/duplicate`, arg)
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
        return rs
      } catch (e) { throw e }
    },
    async setItem(arg?: any) {
      this.item = arg ? { ...arg } : JSON.parse(JSON.stringify(constant))
    },
    async setItems(arg?: any) {
      this.items = arg ? arg : []
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
    addTypeGroup(item: IModelProduct, typeLabel?: string, optionLabel?: string) {
      if (!item.types) item.types = []
      const option: IProductTypeOption = { id: 1, label: optionLabel }
      item.types.push({ label: typeLabel, options: [option] })
      this.pushTypeDataOption(item, item.types.length - 1, option)
      return item
    },
    removeTypeGroup(item: IModelProduct, indexGroup: number) {
      item.types.splice(indexGroup, 1)
      if (item.types.length < 1) item.types = null
      this.removeTypeDataGroup(item)
      return item.types
    },
    addTypeOption(options: IProductTypeOption[], optionLabel?: string) {
      const option = { id: this.generatorIdType(options), label: optionLabel }
      options.push(option)
      return { options, option }
    },
    addTypeOptionItem(item: IModelProduct, indexType: number, optionLabel?: string) {
      const option = { id: this.generatorIdType(item.types[indexType].options), label: optionLabel }
      item.types[indexType].options.push(option)
      this.pushTypeDataOption(item, indexType, option)
      return { options: item.types[indexType].options, option }
    },
    removeTypeOption(options: IProductTypeOption[], optionId: number) {
      const index = options.findIndex(x => x.id === optionId)
      if (index > -1) options.splice(index, 1)
      return options
    },
    removeTypeOptionItem(item: IModelProduct, indexType: number, optionId: number) {
      const index = item.types[indexType].options.findIndex(x => x.id === optionId)
      if (index > -1) item.types[indexType].options.splice(index, 1)
      this.removeTypeDataOption(item, optionId)
      return item.types[indexType].options
    },
    pushTypeData(item: IModelProduct, option: IProductTypeOption) {
      if (!item.typeData) item.typeData = {} as any
      if (item.types.length == 1) {
        item.typeData[option.id] = { ...{}, ...this.typeData }
      } else {
        item.typeData[option.id] = {}
        for (let i = 0; i < item.types[1].options.length; i++) {
          item.typeData[option.id][item.types[1].options[i].id] = { ...{}, ...this.typeData }
        }
      }
    },
    pushTypeDataOption(item: IModelProduct, indexGroup?: number, option?: IProductTypeOption) {
      if (!item.typeData) item.typeData = {} as any
      if (indexGroup < 1) {
        if (item.types.length === 1) {
          item.typeData[option.id] = { ...{}, ...this.typeData }
        } else {
          item.typeData[option.id] = {}
          for (let i = 0; i < item.types[1].options.length; i++) {
            item.typeData[option.id][item.types[1].options[i].id] = { ...{}, ...this.typeData }
          }
        }
      } else {
        // Check first push type 2
        if (item.types[1].options.length === 1) {
          const cloneTypeData = {} as IProductTypeData
          for (const e in item.typeData) {
            cloneTypeData[e] = {}
            // cloneTypeData[e][option.id] = Object.keys(typeData[e]).length ? new TypeData(typeData[e].price, typeData[e].priceImport, typeData[e].quantity) : new TypeData()// Object.keys(typeData[e]).length ? { ...typeData[e] } : new TypeData()
            cloneTypeData[e][option.id] = Object.keys(item.typeData[e]).length ? { ...{}, ...item.typeData[e] } : { ...{}, ...this.TypeData }
          }
          item.typeData = cloneTypeData
        } else {
          for (const e in item.typeData)
            item.typeData[e][option.id] = { ...{}, ...this.typeData }
        }
      }
      return item.typeData
    },
    fixTypeData(item: IModelProduct) {
      if (!item.types || !item.types.length || !item.typeData) return false
      if (item.types.length == 1) {
        const cloneTypeData = {} as IProductTypeData
        for (const e of item.types[0].options) {
          cloneTypeData[e.id] = item.typeData[e.id]
        }
        item.typeData = cloneTypeData
      } else if (item.types.length > 1) {
        const cloneTypeData = {} as IProductTypeData
        for (const e of item.types[0].options) {
          cloneTypeData[e.id] = {}
          for (const i of item.types[1].options) {
            cloneTypeData[e.id][i.id] = item.typeData[e.id][i.id]
          }
        }
        item.typeData = cloneTypeData
      }
      return item.typeData
    },
    removeTypeDataGroup(item: IModelProduct) {
      if (!item.types || item.types.length < 1) return null
      if (item.types.length === 1) {
        item.typeData = Object.values(item.typeData)[0]
      } else {
        const cloneTypeData = {}
        for (const e in item.typeData)
          cloneTypeData[e] = Object.values(item.typeData[e][0])
        item.typeData = cloneTypeData
      }
    },
    removeTypeDataOption(item: IModelProduct, optionId: number) {
      if (item.types.length === 1) {
        delete item.typeData[optionId]
      } else {
        for (const e in item.typeData) {
          delete item.typeData[e][optionId]
        }
      }
      return item.typeData
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
