import { Service } from 'typedi'
import { HttpException } from '@exceptions/http.exception'
import { MUser, IUser } from './model'
import { Aggregate, ClientSession, Types } from 'mongoose'
import { NewGuid, SHA256 } from '@utils/tm-crypto'

@Service()
export class UserService {
  public FindAll(conditions: object): Aggregate<IUser[]> {
    return MUser.aggregate([
      { $match: conditions },
      {
        $lookup: {
          from: 'roles',
          let: { roles: '$roles' },
          as: 'userRoles',
          pipeline: [
            { $addFields: { 'roleId': { $toString: '$_id' } } },
            { $match: { $expr: { $and: [{ $in: ['$roleId', '$$roles'] }] } } },
            { $project: { _id: 1, key: 1, name: 1, level: 1, color: 1 } }
          ]
        }
      }
      // { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$roles', 0] }, '$$ROOT'] } } },
      // { $project: { roles: 0 } }
    ])
  }

  public async FindSelect(conditions: object, fields?: string): Promise<any> {
    if (fields) return MUser.find(conditions).select(fields)
    else return MUser.find(conditions)
  }

  public async FindOne(conditions: object, fields?: string): Promise<any> {
    if (fields) return MUser.findOne(conditions).select(fields)
    else return MUser.findOne(conditions)
  }

  public async Distinct(conditions: object, field: string): Promise<any> {
    return await MUser.distinct(field, conditions)
  }

  public async FindById(_id: Types.ObjectId): Promise<IUser> {
    const rs: IUser = await MUser.findOne({ _id: _id })
    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async Create(data: IUser, session?: ClientSession): Promise<IUser> {
    const exist = await this.FindOne({ username: data.username })
    if (exist) throw new HttpException(409, `exist`)
    const password = data.password || NewGuid().split('-')[0]
    data.salt = NewGuid({ format: 'n' })
    data.password = SHA256(password + data.salt)

    const rs = new MUser(data)
    rs.validateSync()
    if (session) return await rs.save({ session: session })
    else return await rs.save()
  }

  public async Update(data: IUser, session?: ClientSession): Promise<IUser> {
    const set = {} as IUser
    if (data.group !== undefined) set.group = data.group
    if (data.email !== undefined) set.email = data.email
    if (data.fullName !== undefined) set.fullName = data.fullName
    if (data.phone !== undefined) set.phone = data.phone
    if (data.personNumber !== undefined) set.personNumber = data.personNumber
    if (data.region !== undefined) set.region = data.region
    if (data.avatar !== undefined) set.avatar = data.avatar
    if (data.dateBirth !== undefined) set.dateBirth = data.dateBirth
    if (data.gender !== undefined) set.gender = data.gender
    if (data.address !== undefined) set.address = data.address
    if (data.roles !== undefined) set.roles = data.roles
    if (data.note !== undefined) set.note = data.note

    if (!Object.keys(set).length) return null

    const rs = session ?
      await MUser.findByIdAndUpdate(data._id, { $set: set }, { session: session }) :
      await MUser.findByIdAndUpdate(data._id, { $set: set })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async UpdatePassword(_id: Types.ObjectId, password: string, salt: string, session?: ClientSession): Promise<IUser> {
    password = password || NewGuid().split('-')[0]
    password = SHA256(password + salt)
    //  db.getCollection('customized').updateMany({ id: "6536350e17649c38f21b78f4" }, [{ $set: { background: { "draw": "$background", "filePath": null },files:[] } }]);
    const rs: IUser = session ?
      await MUser.findByIdAndUpdate(_id, { $set: { password: password } }, { session: session }) :
      await MUser.findByIdAndUpdate(_id, { $set: { password: password } })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async UpdateVerify(_id: Types.ObjectId, flag: boolean, session?: ClientSession): Promise<IUser> {
    const rs: IUser = session ?
      await MUser.findByIdAndUpdate(_id, { $set: { verified: flag } }, { session: session }) :
      await MUser.findByIdAndUpdate(_id, { $set: { verified: flag } })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async UpdateFlag(_id: Types.ObjectId, flag: boolean, session?: ClientSession): Promise<IUser> {
    const rs: IUser = session ?
      await MUser.findByIdAndUpdate(_id, { $set: { enable: flag } }, { session: session }) :
      await MUser.findByIdAndUpdate(_id, { $set: { enable: flag } })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async Delete(_id: Types.ObjectId, session?: ClientSession): Promise<IUser> {
    const rs: IUser = session ?
      await MUser.findByIdAndDelete(_id, { session: session }) :
      await MUser.findByIdAndDelete(_id)

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }
}
