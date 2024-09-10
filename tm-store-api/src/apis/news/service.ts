import { Service } from 'typedi'
import { HttpException } from '@exceptions/http.exception'
import { MNews, INews } from './model'
import { Aggregate, ClientSession, Types } from 'mongoose'

@Service()
export class NewsService {
  public FindAll(conditions: object): Aggregate<INews[]> {
    if (conditions) return MNews.aggregate([{ $match: conditions }])
    else MNews.find()
  }

  public async FindSelect(conditions: object, fields?: string): Promise<any> {
    if (fields) return MNews.find(conditions).select(fields)
    else return MNews.find(conditions)
  }

  public async FindOne(conditions: object, fields?: string): Promise<any> {
    if (fields) return MNews.findOne(conditions).select(fields)
    else return MNews.findOne(conditions)
  }

  public async Distinct(conditions: object, field: string): Promise<any> {
    return await MNews.distinct(field, conditions)
  }

  public async FindById(_id: Types.ObjectId): Promise<INews> {
    const rs: INews = await MNews.findOne({ _id: _id })
    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async Create(data: INews, session?: ClientSession): Promise<INews> {
    const exist = await this.FindOne({ code: data.code })
    if (exist) throw new HttpException(409, `exist`)
    const rs = new MNews(data)
    rs.validateSync()
    if (session) return await rs.save({ session: session })
    else return await rs.save()
  }

  public async Update(data: INews, session?: ClientSession): Promise<INews> {
    const set = {
      groups: data.groups,
      title: data.title,
      code: data.code,
      desc: data.desc,
      content: data.content,
      url: data.url,
      images: data.images,
      author: data.author,
      date: data.date,
      pins: data.pins,
      tags: data.tags,
      attr: data.attr,
      meta: data.meta,
      attach: data.attach,
      startAt: data.startAt,
      endAt: data.endAt,
      order: data.order,
      flag: data.flag
    } as INews

    const rs = session ?
      await MNews.findByIdAndUpdate(data._id, { $set: set }, { session: session }) :
      await MNews.findByIdAndUpdate(data._id, { $set: set })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async UpdateFlag(_id: Types.ObjectId, flag: boolean, session?: ClientSession): Promise<INews> {
    const rs: INews = session ?
      await MNews.findByIdAndUpdate(_id, { $set: { enable: flag } }, { session: session }) :
      await MNews.findByIdAndUpdate(_id, { $set: { enable: flag } })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async Delete(_id: Types.ObjectId, session?: ClientSession): Promise<INews> {
    const rs: INews = session ?
      await MNews.findByIdAndUpdate(_id, { session: session }) :
      await MNews.findByIdAndUpdate(_id)

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }
}
