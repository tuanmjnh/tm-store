import { model, Schema, Document, Types } from 'mongoose'
import { ICreated, IMeta } from '@interfaces/common'

export interface IType {
  _id?: Types.ObjectId
  key: string
  code: string
  name: string
  desc: string
  meta: Array<IMeta>
  order: number
  flag: number
  created: ICreated
}

const schema: Schema = new Schema({
  // _id: { type: String },
  key: { type: String, required: true, unique: true },
  code: { type: String, required: true, lowercase: true },
  name: { type: String, required: true },
  desc: { type: String, default: null },
  meta: { type: Array, default: null },
  order: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } }
})

export const MType = model<IType & Document>('types', schema)
schema.index({ key: 'text', code: 'text', name: 'text' })
