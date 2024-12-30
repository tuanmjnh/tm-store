import { Request } from 'express'
import { User } from '@interfaces/users.interface'
import { Types } from 'mongoose'

export interface DataStoredInToken {
  _id: Types.ObjectId
}

export interface TokenData {
  token: string
  expiresIn: number
}

export interface RequestWithUser extends Request {
  [x: string]: any
  user: User
}

export interface RequestMiddlewares extends Request {
  verify: {
    _id: Types.ObjectId,
    token: string,
    secret: string
  }
  user: User
}
