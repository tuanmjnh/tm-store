export interface IUser {
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
