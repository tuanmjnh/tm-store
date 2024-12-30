import { model, Schema, Document, Types } from 'mongoose'
import { ICreated, IMeta, IFileAttach } from '../../interfaces/common'

export interface INews {
  _id?: Types.ObjectId
  code: string
  groups: Array<Types.ObjectId>
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
  images: Array<IFileAttach>
  attach: Array<IFileAttach>
  startAt: Date
  endAt: Date
  order: number
  flag: number
  created: ICreated
}

const schema: Schema = new Schema({
  // _id: { type: String },
  code: { type: String, default: null, uppercase: true },
  groups: { type: Array, default: null },
  title: { type: String, required: true },
  desc: { type: String, default: null },
  content: { type: String, default: null },
  url: { type: String, default: null },
  author: { type: String, default: null },
  date: { type: Date, default: null },
  pins: { type: Array, default: null },
  tags: { type: Array, default: null },
  attr: { type: Array, default: null },
  meta: { type: Array, default: null },
  images: { type: Array, default: null },
  attach: { type: Array, default: null },
  startAt: { type: Date, default: null },
  endAt: { type: Date, default: null },
  orders: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } }
})

export const MNews = model<INews & Document>('news', schema)
schema.index({ code: 'text', title: 'text', author: 'text' })
