import { Types } from 'mongoose'
import { IUserAuth } from './model'

export const constantUsers: IUserAuth[] = [
  {
    _id: new Types.ObjectId('5ec9dc4f50d47517fe4f0629'),
    username: 'root',
    password: '2d15894b687a2e7230403d42ff111f5300c9643c818a96743803f53258a03cd4', // 43cb52f9
    group: '',
    salt: 'c1a41699367941a38d0e57ad4a69d2a2',
    fullName: 'Root',
    email: '',
    phone: '',
    personNumber: '',
    region: '',
    avatar: [''],
    note: '',
    dateBirth: new Date(),
    gender: '',
    address: '',
    roles: ['root'],
    routes: [],
    verified: true,
    enable: true,
    lastLogin: new Date(),
    lastChangePass: undefined,
    created: { at: new Date(), by: 'root', ip: '0.0.0.0' }
  }
]

export const constantRoutes = [
  'manager',
  'manager-users',
  'manager-users-view',
  'manager-users-add',
  'manager-users-edit',
  'manager-users-trash',
  'manager-roles',
  'manager-roles-view',
  'manager-roles-add',
  'manager-roles-edit',
  'manager-roles-trash',
  'manager-types',
  'manager-types-view',
  'manager-types-add',
  'manager-types-edit',
  'manager-types-trash'
]
