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

  public async FindSelect(conditions: object, fields?: string): Promise<IConnect[]> {
    if (fields) return MConnect.find(conditions).select(fields)
    else return MConnect.find(conditions)
  }

  public async FindOne(conditions: object, fields?: string): Promise<IConnect> {
    if (fields) return MConnect.findOne(conditions).select(fields)
    else return MConnect.findOne(conditions)
  }

  public async Distinct(conditions: object, field: string): Promise<any> {
    return await MConnect.distinct(field, conditions)
  }

  public async FindById(_id: Types.ObjectId, fields?: string): Promise<IConnect> {
    if (fields) return await MConnect.findOne({ _id: _id }).select(fields)
    return await MConnect.findOne({ _id: _id })
  }

  public async FindByKey(key: string, fields?: string): Promise<IConnect> {
    if (fields) return await MConnect.findOne({ key: key }).select(fields)
    return await MConnect.findOne({ key: key })
  }

  public async Create(data: IConnect, session?: ClientSession): Promise<IConnect> {
    const exist = await this.FindOne({ key: data.key })
    if (exist) throw new HttpException(409, `exist`)
    const rs = new MConnect(data)
    rs.validateSync()
    if (session) return await rs.save({ session: session })
    else return await rs.save()
  }

  public async Update(data: any, session?: ClientSession): Promise<IConnect> {
    // const set = {
    //   order: data.order || 1,
    //   clientID: data.clientID || null,
    //   credentials: data.credentials || null,
    //   authUri: data.authUri || null,
    //   redirectUris: data.redirectUris || null,
    //   profile: data.profile || null,
    //   config: data.config || null,
    // } as IConnect
    const set = {} as any
    if (data.order !== undefined) set.order = data.order
    if (data.clientID !== undefined) set.clientID = data.clientID
    if (data.credentials !== undefined) set.credentials = data.credentials
    if (data.authUri !== undefined) set.authUri = data.authUri
    if (data.redirectUris !== undefined) set.redirectUris = data.redirectUris
    if (data.profile !== undefined) set.profile = data.profile
    if (data.config !== undefined) set.config = data.config
    const rs = session ?
      await MConnect.findByIdAndUpdate(data._id, { $set: set }, { session: session, new: true }) :
      await MConnect.findByIdAndUpdate(data._id, { $set: set }, { new: true })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async UpdateFlag(_id: Types.ObjectId, flag: boolean, session?: ClientSession): Promise<IConnect> {
    const rs: IConnect = session ?
      await MConnect.findByIdAndUpdate(_id, { $set: { flag: flag } }, { session: session, new: true }) :
      await MConnect.findByIdAndUpdate(_id, { $set: { flag: flag } }, { new: true })

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
