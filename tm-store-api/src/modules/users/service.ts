import { hash } from 'bcrypt'
import { Service } from 'typedi'
import { HttpException } from '../../exceptions/http.exception'
import { User } from '../../interfaces/users.interface'
import { UserModel } from './model'
import { Types } from 'mongoose'

@Service()
export class UserService {
  public async findAllUser(): Promise<User[]> {
    const users: User[] = await UserModel.find()
    return users
  }

  public async findUserById(userId: string): Promise<User> {
    const findUser: User = await UserModel.findOne({ _id: userId })
    if (!findUser) throw new HttpException(409, "User doesn't exist")

    return findUser
  }

  public async createUser(userData: User): Promise<User> {
    const findUser: User = await UserModel.findOne({ email: userData.email })
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`)

    const hashedPassword = await hash(userData.password, 10)
    const createUserData: User = await UserModel.create({ ...userData, password: hashedPassword })

    return createUserData
  }

  public async updateUser(userId: Types.ObjectId, userData: User): Promise<User> {
    if (userData.email) {
      const findUser: User = await UserModel.findOne({ email: userData.email })
      if (findUser && findUser._id != userId) throw new HttpException(409, `This email ${userData.email} already exists`)
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10)
      userData = { ...userData, password: hashedPassword }
    }

    const updateUserById: User = await UserModel.findByIdAndUpdate(userId, { userData })
    if (!updateUserById) throw new HttpException(409, "User doesn't exist")

    return updateUserById
  }

  public async deleteUser(userId: string): Promise<User> {
    const deleteUserById: User = await UserModel.findByIdAndDelete(userId)
    if (!deleteUserById) throw new HttpException(409, "User doesn't exist")

    return deleteUserById
  }
}
