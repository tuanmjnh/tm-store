import { model, Schema, Document, Types } from 'mongoose'
import { ICreated } from '@interfaces/common'

export interface IConnect {
  _id?: Types.ObjectId
  name: string
  key: string
  order: number
  clientID: object
  credentials: object
  authUri: string
  redirectUris: string
  profile: object
  config: object
  flag: number
  created: ICreated
}

const schema: Schema = new Schema({
  // _id: { type: String },
  name: { type: String, required: true },
  key: { type: String, required: true },
  order: { type: Number, default: 1 },
  clientID: { type: Object, default: null },
  credentials: { type: Object, default: null },
  authUri: { type: String, default: null },
  redirectUris: { type: String, default: null },
  profile: { type: Object, default: null },
  config: { type: Object, default: null },
  flag: { type: Number, default: 1 },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } }
})

export const MConnect = model<IConnect & Document>('connects', schema)
