import { Service } from 'typedi'
import { HttpException } from '@exceptions/http.exception'
import { MRole, IRole} from './model'
import { Aggregate, ClientSession, Types } from 'mongoose'

@Service()
export class RoleService {
  public FindAll(conditions: object): Aggregate<IRole[]> {
    if (conditions) return MRole.aggregate([{ $match: conditions }])
    else MRole.find()
  }

  public async FindSelect(conditions: object, fields?: string): Promise<any> {
    if (fields) return MRole.find(conditions).select(fields)
    else return MRole.find(conditions)
  }

  public async FindOne(conditions: object, fields?: string): Promise<any> {
    if (fields) return MRole.findOne(conditions).select(fields)
    else return MRole.findOne(conditions)
  }

  public async Distinct(conditions: object, field: string): Promise<any> {
    return await MRole.distinct(field, conditions)
  }

  public async FindById(_id: Types.ObjectId): Promise<IRole> {
    const rs: IRole = await MRole.findOne({ _id: _id })
    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async Create(data: IRole, session?: ClientSession): Promise<IRole> {
    const exist = await this.FindOne({ key: data.key })
    if (exist) throw new HttpException(409, `exist`)
    const rs = new MRole(data)
    rs._id = new Types.ObjectId()
    rs.validateSync()
    if (session) return await rs.save({ session: session })
    else return await rs.save()
  }

  public async Update(data: IRole, session?: ClientSession): Promise<IRole> {
    const set = {
      name: data.name,
      desc: data.desc,
      level: data.level,
      color: data.color,
      routes: data.routes
    } as IRole

    const rs = session ?
      await MRole.findByIdAndUpdate(data._id, { $set: set }, { session: session }) :
      await MRole.findByIdAndUpdate(data._id, { $set: set })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async UpdateFlag(_id: Types.ObjectId, flag: boolean, session?: ClientSession): Promise<IRole> {
    const rs: IRole = session ?
      await MRole.findByIdAndUpdate(_id, { $set: { flag: flag } }, { session: session }) :
      await MRole.findByIdAndUpdate(_id, { $set: { flag: flag } })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async Delete(_id: Types.ObjectId, session?: ClientSession): Promise<IRole> {
    const rs: IRole = session ?
      await MRole.findByIdAndDelete(_id, { session: session }) :
      await MRole.findByIdAndDelete(_id)

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }
}
