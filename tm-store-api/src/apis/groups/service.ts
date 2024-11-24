import { Service } from 'typedi'
import { HttpException } from '@exceptions/http.exception'
import { MGroup, IGroup } from './model'
import { Aggregate, ClientSession, Types } from 'mongoose'

@Service()
export class GroupService {
  public FindAll(conditions?: object): Aggregate<IGroup[]> {
    if (conditions) return MGroup.aggregate([{ $match: conditions }])
    else MGroup.find()
  }

  public async FindSelect(conditions: object, fields?: string): Promise<any> {
    if (fields) return MGroup.find(conditions).select(fields)
    else return MGroup.find(conditions)
  }

  public async FindOne(conditions: object, fields?: string): Promise<any> {
    if (fields) return MGroup.findOne(conditions).select(fields)
    else return MGroup.findOne(conditions)
  }

  public async Distinct(conditions: object, field: string): Promise<any> {
    return await MGroup.distinct(field, conditions)
  }

  public async FindById(_id: Types.ObjectId): Promise<IGroup> {
    const rs: IGroup = await MGroup.findOne({ _id: _id })
    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async Create(data: IGroup, session?: ClientSession): Promise<IGroup> {
    const exist = await this.FindOne({ code: data.code })
    if (exist) throw new HttpException(409, `exist`)
    const rs = new MGroup(data)
    rs._id = new Types.ObjectId()
    rs.validateSync()
    if (session) return await rs.save({ session: session })
    else return await rs.save()
  }

  public async Update(data: IGroup, session?: ClientSession): Promise<IGroup> {
    const set = {
      type: data.type,
      parent: data.parent,
      code: data.code,
      title: data.title,
      desc: data.desc,
      level: data.level,
      content: data.content,
      url: data.url,
      images: data.images,
      quantity: data.quantity,
      position: data.position,
      tags: data.tags,
      icon: data.icon,
      color: data.color,
      meta: data.meta,
      startAt: data.startAt,
      endAt: data.endAt,
      order: data.order,
      flag: data.flag
    } as IGroup

    const rs = session ?
      await MGroup.findByIdAndUpdate(data._id, { $set: set }, { session: session, new: true }) :
      await MGroup.findByIdAndUpdate(data._id, { $set: set }, { new: true })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async UpdateOrder({ _id, parent, level, order }, session?: ClientSession): Promise<IGroup> {
    const set = {
      parent: parent,
      level: level,
      order: order
    }
    const rs: IGroup = session ?
      await MGroup.findByIdAndUpdate(_id, { $set: set }, { session: session, new: true }) :
      await MGroup.findByIdAndUpdate(_id, { $set: set }, { new: true })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async UpdateFlag(_id: Types.ObjectId, flag: boolean, session?: ClientSession): Promise<IGroup> {
    const rs: IGroup = session ?
      await MGroup.findByIdAndUpdate(_id, { $set: { flag: flag } }, { session: session, new: true }) :
      await MGroup.findByIdAndUpdate(_id, { $set: { flag: flag } }, { new: true })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async Delete(_id: Types.ObjectId, session?: ClientSession): Promise<IGroup> {
    const rs: IGroup = session ?
      await MGroup.findByIdAndUpdate(_id, { session: session }) :
      await MGroup.findByIdAndUpdate(_id)

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }
}
