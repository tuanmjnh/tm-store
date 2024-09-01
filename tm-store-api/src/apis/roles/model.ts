import { model, Schema, Document, Types } from 'mongoose'
import { ICreated } from '@interfaces/common'

export interface IRole {
  _id?: Types.ObjectId
  key: string
  name: string
  desc: string
  level: number
  color: string
  routes: Array<string>
  flag: number
  created: ICreated
}

const schema: Schema = new Schema({
  // _id: { type: String },
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  desc: { type: String, default: null },
  level: { type: Number, default: 1 },
  color: { type: String, default: '#027be3' },
  routes: { type: Array, default: null },
  flag: { type: Number, default: 1 },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } }
})

export const MRole = model<IRole & Document>('roles', schema)
schema.index({ key: 'text', name: 'text' })
