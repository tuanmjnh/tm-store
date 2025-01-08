import { model, Schema, Document, Types } from 'mongoose'
import { ICreated, IMeta, IFileAttach } from '../../interfaces/common'

export interface IProductTypeOption {
  id: number
  label: string
}
export interface IProductType {
  label: string
  options: Array<IProductTypeOption>
}
export interface IProductTypeData {
  price: number
  priceImport: number
  quantity: number
}

export interface IProduct {
  _id?: Types.ObjectId
  code: string
  groups: Array<Types.ObjectId>
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
  images: Array<IFileAttach>
  attach: Array<IFileAttach>
  qrcode: string
  barcode: string
  order: number
  flag: number
  created: ICreated
}

const schema: Schema = new Schema({
  // _id: { type: String },
  // type: { type: String, default: null },
  code: { type: String, required: true, uppercase: true, unique: true },
  groups: { type: Array, default: null },
  // categories: { type: mongoose.Schema.Types.ObjectId, ref: 'categories', required: true },
  // subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'subCategory', required: true },
  title: { type: String, required: true },
  desc: { type: String, default: null },
  content: { type: String, default: null },
  types: { type: Array, default: null },
  typeData: { type: Object, default: null },
  quantity: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  priceImport: { type: Number, default: 0 },
  priceExport: { type: Number, default: 0 },
  // priceDiscount: { type: Number, default: 0 },
  // priceUnit: { type: String, default: null }, // { type: mongoose.Schema.Types.ObjectId, ref: 'types' },
  unit: { type: String, default: null }, // { type: mongoose.Schema.Types.ObjectId, ref: 'types' },
  brand: { type: String, default: null },
  originName: { type: String, default: null },
  originAddress: { type: String, default: null },
  weight: { type: Number, default: 0 },
  date: { type: String, default: null },
  pins: { type: Array, default: null },
  tags: { type: Array, default: null },
  attr: { type: Array, default: null },
  meta: { type: Array, default: null },
  images: { type: Array, default: null },
  attach: { type: Array, default: null },
  qrcode: { type: String, default: null },
  barcode: { type: String, default: null },
  // start_at: { type: Date, default: null },
  // end_at: { type: Date, default: null },
  order: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } }
})

export const MProduct = model<IProduct & Document>('products', schema)
schema.index({ code: 'text', title: 'text', brand: 'text', qrcode: 'text', barcode: 'text' })
