import { model, Schema, Document, Types } from 'mongoose'
import { ICreated } from '@interfaces/common'

export interface IConfig {
  _id?: Types.ObjectId
  key: string
  value: string
  type: string
  level: number
  flag: number
  desc: string
  created: ICreated
}

const schema: Schema = new Schema({
  // _id: { type: String },
  key: { type: String, required: true, lowercase: true, unique: true },
  value: { type: String, required: true },
  type: { type: String, default: 'string' },
  level: { type: Number, default: 0 },
  flag: { type: Number, default: 1 },
  desc: { type: String, default: null }
})

export const MConfig = model<IConfig & Document>('configs', schema)
