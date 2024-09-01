import { model, Schema, Document, Types } from 'mongoose'
import { ICreated } from '@interfaces/common'

export interface IUser  {
  _id?: Types.ObjectId
  username: string
  password: string
  group: string
  salt: string
  fullName: string
  email: string
  phone: string
  personNumber: string
  region: string
  avatar: Array<string>
  note: string
  dateBirth: Date,
  gender: string
  address: string
  roles: Array<string>
  verified: boolean
  enable: boolean
  lastLogin: Date,
  lastChangePass: Date,
  created: ICreated
}

const schema: Schema = new Schema({
  // _id: { type: String },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  group: { type: String, default: null },
  salt: { type: String, required: true },
  fullName: { type: String, default: null },
  email: { type: String, required: true },
  phone: { type: String, default: null },
  personNumber: { type: String, default: null },
  region: { type: String, default: null },
  avatar: { type: Array, default: null },
  note: { type: String, default: null },
  dateBirth: { type: Date, default: null },
  gender: { type: String, default: null },
  address: { type: String, default: null },
  roles: { type: Array, default: null },
  verified: { type: Boolean, default: false },
  enable: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null },
  lastChangePass: { type: Date, default: null },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } }
})

export const MUser = model<IUser & Document>('users', schema)
schema.index({ username: 'text', fullName: 'text', email: 'text', phone: 'text', personNumber: 'text', address: 'text' })
