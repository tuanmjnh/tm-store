import { model, Schema, Document, Types } from 'mongoose'
import { ICreated, IMeta, IFileAttach } from '../../interfaces/common'

export interface IGroup {
  _id?: Types.ObjectId
  type: string
  parent: Types.ObjectId
  code: string
  title: string
  desc: string
  level: number
  content: string
  url: string
  images: Array<IFileAttach>
  quantity: number
  position: Array<string>
  tags: Array<string>
  icon: string
  color: string
  meta: Array<IMeta>
  startAt: Date
  endAt: Date
  order: number
  flag: number
  created: ICreated
}

const schema: Schema = new Schema({
  // _id: { type: String },
  type: { type: String, required: true },
  parent: { type: Types.ObjectId, default: null },
  code: { type: String, required: true, uppercase: true },
  title: { type: String, required: true },
  desc: { type: String, default: null },
  level: { type: Number, default: 1 },
  content: { type: String, default: null },
  url: { type: String, default: null },
  images: { type: Array, default: null },
  quantity: { type: Number, default: null },
  position: { type: Array, default: ['left'] },
  tags: { type: Array, default: null },
  icon: { type: String, default: null },
  color: { type: String, default: null },
  meta: { type: Array, default: null },
  startAt: { type: Date, default: null },
  endAt: { type: Date, default: null },
  order: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } }
})

export const MGroup = model<IGroup & Document>('groups', schema)
schema.index({ key: 'text', name: 'text' })
