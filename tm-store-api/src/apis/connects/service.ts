import { Service } from 'typedi'
import { HttpException } from '@exceptions/http.exception'
import { MConnect, IConnect } from './model'
import { Aggregate, ClientSession, Types } from 'mongoose'

@Service()
export class ConnectService {
  public FindAll(conditions: object): Aggregate<IConnect[]> {
    if (conditions) return MConnect.aggregate([{ $match: conditions }])
    else MConnect.find()
  }

  public async FindSelect(conditions: object, fields?: string): Promise<any> {
    if (fields) return MConnect.find(conditions).select(fields)
    else return MConnect.find(conditions)
  }

  public async FindOne(conditions: object, fields?: string): Promise<any> {
    if (fields) return MConnect.findOne(conditions).select(fields)
    else return MConnect.findOne(conditions)
  }

  public async Distinct(conditions: object, field: string): Promise<any> {
    return await MConnect.distinct(field, conditions)
  }

  public async FindById(_id: Types.ObjectId): Promise<IConnect> {
    const rs: IConnect = await MConnect.findOne({ _id: _id })
    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async Create(data: IConnect, session?: ClientSession): Promise<IConnect> {
    const exist = await this.FindOne({ key: data.key })
    if (exist) throw new HttpException(409, `exist`)
    const rs = new MConnect(data)
    rs._id = new Types.ObjectId()
    rs.validateSync()
    if (session) return await rs.save({ session: session })
    else return await rs.save()
  }

  public async Update(data: IConnect, session?: ClientSession): Promise<IConnect> {
    const set = {
      name: data.name,
      // key: data.key.toLowerCase(),
      order: data.order,
      clientID: data.clientID,
      credentials: data.credentials,
      authUri: data.authUri,
      redirectUris: data.redirectUris
    } as IConnect

    const rs = session ?
      await MConnect.findByIdAndUpdate(data._id, { $set: set }, { session: session }) :
      await MConnect.findByIdAndUpdate(data._id, { $set: set })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async UpdateFlag(_id: Types.ObjectId, flag: boolean, session?: ClientSession): Promise<IConnect> {
    const rs: IConnect = session ?
      await MConnect.findByIdAndUpdate(_id, { $set: { flag: flag } }, { session: session }) :
      await MConnect.findByIdAndUpdate(_id, { $set: { flag: flag } })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async Delete(_id: Types.ObjectId, session?: ClientSession): Promise<IConnect> {
    const rs: IConnect = session ?
      await MConnect.findByIdAndDelete(_id, { session: session }) :
      await MConnect.findByIdAndDelete(_id)

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }
}
