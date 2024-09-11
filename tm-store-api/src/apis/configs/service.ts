import { Service } from 'typedi'
import { HttpException } from '@exceptions/http.exception'
import { MConfig, IConfig } from './model'
import { Aggregate, ClientSession, Types } from 'mongoose'
import { EConfigType } from '@interfaces/common'
import moment from 'moment'
export const InitializeConfig = async (app) => {
  try {
    app.locals.configs = {} as any
    return MConfig.find().then(x => {
      x.forEach(e => {
        if (e.type) {
          switch (e.type) {
            case EConfigType.INT:
              app.locals.configs[e.key] = parseInt(e.value)
              break;
            case EConfigType.FLOAT:
              app.locals.configs[e.key] = parseFloat(e.value)
              break;
            case EConfigType.BOOLEAN:
              app.locals.configs[e.key] = e.value === 'true' ? true : false
              break;
            case EConfigType.DATE:
              app.locals.configs[e.key] = moment(e.value)
              break;
            default:
              app.locals.configs[e.key] = e.value
              break;
          }
        } else app.locals.configs[e.key] = e.value
        if (e.key == 'upload_max_size') process.env.UPLOAD_MAX_SIZE = e.value
      })
    })
  } catch (e) {
    // console.log(e)
  }
}
@Service()
export class ConfigService {
  public FindAll(conditions: object): Aggregate<IConfig[]> {
    if (conditions) return MConfig.aggregate([{ $match: conditions }])
    else MConfig.find()
  }

  public async FindSelect(conditions: object, fields?: string): Promise<any> {
    if (fields) return MConfig.find(conditions).select(fields)
    else return MConfig.find(conditions)
  }

  public async FindOne(conditions: object, fields?: string): Promise<any> {
    if (fields) return MConfig.findOne(conditions).select(fields)
    else return MConfig.findOne(conditions)
  }

  public async Distinct(conditions: object, field: string): Promise<any> {
    return await MConfig.distinct(field, conditions)
  }

  public async FindById(_id: Types.ObjectId): Promise<IConfig> {
    const rs: IConfig = await MConfig.findOne({ _id: _id })
    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async Create(data: IConfig, session?: ClientSession): Promise<IConfig> {
    const exist = await this.FindOne({ key: data.key })
    if (exist) throw new HttpException(409, `exist`)
    const rs = new MConfig(data)
    rs.validateSync()
    if (session) return await rs.save({ session: session })
    else return await rs.save()
  }

  public async Update(data: IConfig, session?: ClientSession): Promise<IConfig> {
    const set = {
      key: data.key.toLowerCase(),
      value: data.value,
      type: data.type ? data.type : 'string',
      level: data.level,
      desc: data.desc
    } as IConfig

    const rs = session ?
      await MConfig.findByIdAndUpdate(data._id, { $set: set }, { session: session }) :
      await MConfig.findByIdAndUpdate(data._id, { $set: set })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async UpdateFlag(_id: Types.ObjectId, flag: boolean, session?: ClientSession): Promise<IConfig> {
    const rs: IConfig = session ?
      await MConfig.findByIdAndUpdate(_id, { $set: { flag: flag } }, { session: session }) :
      await MConfig.findByIdAndUpdate(_id, { $set: { flag: flag } })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async Delete(_id: Types.ObjectId, session?: ClientSession): Promise<IConfig> {
    const rs: IConfig = session ?
      await MConfig.findByIdAndDelete(_id, { session: session }) :
      await MConfig.findByIdAndDelete(_id)

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }
}
