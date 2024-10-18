import { Service } from 'typedi'
import { HttpException } from '@exceptions/http.exception'
import { MType, IType } from './model'
import { Aggregate, ClientSession, Types } from 'mongoose'

@Service()
export class TypeService {
  public FindAll(conditions: object): Aggregate<IType[]> {
    if (conditions) return MType.aggregate([{ $match: conditions }])
    else MType.find()
  }

  public async FindSelect(conditions: object, fields?: string): Promise<any> {
    if (fields) return MType.find(conditions).select(fields)
    else return MType.find(conditions)
  }

  public async FindOne(conditions: object, fields?: string): Promise<any> {
    if (fields) return MType.findOne(conditions).select(fields)
    else return MType.findOne(conditions)
  }

  public async Distinct(conditions: object, field: string): Promise<any> {
    return await MType.distinct(field, conditions)
  }

  public async FindById(_id: Types.ObjectId): Promise<IType> {
    const rs: IType = await MType.findOne({ _id: _id })
    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async Create(data: IType, session?: ClientSession): Promise<IType> {
    const exist = await this.FindOne({ key: data.key, code: data.code })
    if (exist) throw new HttpException(409, `exist`)
    const rs = new MType(data)
    rs._id = new Types.ObjectId()
    rs.validateSync()
    if (session) return await rs.save({ session: session })
    else return await rs.save()
    // if (session) return (await MType.create([data], { session: session }))[0]
    // else return await MType.create(data)
  }

  public async Update(data: IType, session?: ClientSession): Promise<IType> {
    const set = {
      key: data.key,
      code: data.code,
      name: data.name,
      desc: data.desc,
      meta: data.meta,
      order: data.order
    } as IType

    const rs = session ?
      await MType.findByIdAndUpdate(data._id, { $set: set }, { session: session, new: true }) :
      await MType.findByIdAndUpdate(data._id, { $set: set }, { new: true })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async UpdateFlag(_id: Types.ObjectId, flag: boolean, session?: ClientSession): Promise<IType> {
    const rs: IType = session ?
      await MType.findByIdAndUpdate(_id, { $set: { flag: flag } }, { session: session, new: true }) :
      await MType.findByIdAndUpdate(_id, { $set: { flag: flag } }, { new: true })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async Delete(_id: Types.ObjectId, session?: ClientSession): Promise<IType> {
    const rs: IType = session ?
      await MType.findByIdAndDelete(_id, { session: session }) :
      await MType.findByIdAndDelete(_id)

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }
}
