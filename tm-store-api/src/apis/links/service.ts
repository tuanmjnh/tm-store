import { Service } from 'typedi'
import { HttpException } from '@exceptions/http.exception'
import { MLink, ILink } from './model'
import { Aggregate, ClientSession, Types } from 'mongoose'

@Service()
export class LinkService {
  public FindAll(conditions: object): Aggregate<ILink[]> {
    if (conditions) return MLink.aggregate([{ $match: conditions }])
    else MLink.find()
  }

  public async FindSelect(conditions: object, fields?: string): Promise<any> {
    if (fields) return MLink.find(conditions).select(fields)
    else return MLink.find(conditions)
  }

  public async FindOne(conditions: object, fields?: string): Promise<any> {
    if (fields) return MLink.findOne(conditions).select(fields)
    else return MLink.findOne(conditions)
  }

  public async Distinct(conditions: object, field: string): Promise<any> {
    return await MLink.distinct(field, conditions)
  }

  public async FindById(_id: Types.ObjectId): Promise<ILink> {
    const rs: ILink = await MLink.findOne({ _id: _id })
    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async Create(data: ILink, session?: ClientSession): Promise<ILink> {
    const exist = await this.FindOne({ key: data.key })
    if (exist) throw new HttpException(409, `exist`)
    const rs = new MLink(data)
    rs.validateSync()
    if (session) return await rs.save({ session: session })
    else return await rs.save()
  }

  public async Update(data: ILink, session?: ClientSession): Promise<ILink> {
    const set = {
      name: data.name,
      // key: data.key.toLowerCase(),
      order: data.order,
      clientID: data.clientID,
      credentials: data.credentials,
      authUri: data.authUri,
      redirectUris: data.redirectUris
    } as ILink

    const rs = session ?
      await MLink.findByIdAndUpdate(data._id, { $set: set }, { session: session }) :
      await MLink.findByIdAndUpdate(data._id, { $set: set })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async UpdateFlag(_id: Types.ObjectId, flag: boolean, session?: ClientSession): Promise<ILink> {
    const rs: ILink = session ?
      await MLink.findByIdAndUpdate(_id, { $set: { flag: flag } }, { session: session }) :
      await MLink.findByIdAndUpdate(_id, { $set: { flag: flag } })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async Delete(_id: Types.ObjectId, session?: ClientSession): Promise<ILink> {
    const rs: ILink = session ?
      await MLink.findByIdAndDelete(_id, { session: session }) :
      await MLink.findByIdAndDelete(_id)

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }
}
