import { Service } from 'typedi'
import { HttpException } from '@exceptions/http.exception'
import { MProduct, IProduct } from './model'
import { Aggregate, ClientSession, Types } from 'mongoose'

@Service()
export class ProductService {
  public FindAll(conditions: object): Aggregate<IProduct[]> {
    if (conditions) return MProduct.aggregate([{ $match: conditions }])
    else MProduct.find()
  }

  public async FindSelect(conditions: object, fields?: string): Promise<any> {
    if (fields) return MProduct.find(conditions).select(fields)
    else return MProduct.find(conditions)
  }

  public async FindOne(conditions: object, fields?: string): Promise<any> {
    if (fields) return MProduct.findOne(conditions).select(fields)
    else return MProduct.findOne(conditions)
  }

  public async Distinct(conditions: object, field: string): Promise<any> {
    return await MProduct.distinct(field, conditions)
  }

  public async FindById(_id: Types.ObjectId): Promise<IProduct> {
    const rs: IProduct = await MProduct.findOne({ _id: _id })
    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async Create(data: IProduct, session?: ClientSession): Promise<IProduct> {
    const exist = await this.FindOne({ code: data.code })
    if (exist) throw new HttpException(409, `exist`)
    const rs = new MProduct(data)
    rs._id = new Types.ObjectId()
    rs.validateSync()
    if (session) return await rs.save({ session: session })
    else return await rs.save()
  }

  public async Update(data: IProduct, session?: ClientSession): Promise<IProduct> {
    const set = {} as IProduct
    if (data.groups !== undefined) set.groups = data.groups
    if (data.title !== undefined) set.title = data.title
    if (data.code !== undefined) set.code = data.code
    if (data.desc !== undefined) set.desc = data.desc
    if (data.content !== undefined) set.content = data.content
    if (data.images !== undefined) set.images = data.images
    if (data.types !== undefined) set.types = data.types
    if (data.typeData !== undefined) set.typeData = data.typeData
    if (data.quantity !== undefined) set.quantity = data.quantity
    if (data.price !== undefined) set.price = data.price
    if (data.priceImport !== undefined) set.priceImport = data.priceImport
    if (data.priceExport !== undefined) set.priceExport = data.priceExport
    if (data.unit !== undefined) set.unit = data.unit
    if (data.brand !== undefined) set.brand = data.brand
    if (data.originName !== undefined) set.originName = data.originName
    if (data.originAddress !== undefined) set.originAddress = data.originAddress
    if (data.weight !== undefined) set.weight = data.weight
    if (data.date !== undefined) set.date = data.date
    if (data.pins !== undefined) set.pins = data.pins
    if (data.tags !== undefined) set.tags = data.tags
    if (data.attr !== undefined) set.attr = data.attr
    if (data.meta !== undefined) set.meta = data.meta
    if (data.qrcode !== undefined) set.qrcode = data.qrcode
    if (data.barcode !== undefined) set.barcode = data.barcode
    if (data.order !== undefined) set.order = data.order

    const rs = session ?
      await MProduct.findByIdAndUpdate(data._id, { $set: set }, { session: session, new: true }) :
      await MProduct.findByIdAndUpdate(data._id, { $set: set }, { new: true })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async UpdateType(data: IProduct, session?: ClientSession): Promise<IProduct> {
    const set = {} as any
    if (data.types) set.types = data.types
    if (data.typeData) set.typeData = data.typeData

    const rs: IProduct = session ?
      await MProduct.findByIdAndUpdate(data._id, { $set: set }, { session: session, new: true }) :
      await MProduct.findByIdAndUpdate(data._id, { $set: set }, { new: true })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async UpdateTypeDataQuantity(data: any, session?: ClientSession): Promise<IProduct> {
    if (!data.index || data.index.length < 1 || data.quantiy) return null
    let nested = 'typeData'
    data.forEach(e => { nested = `${nested}.${e}` })

    const rs: IProduct = session ?
      await MProduct.findByIdAndUpdate(data._id, { $inc: { nested: data.quantiy } }, { session: session, new: true }) :
      await MProduct.findByIdAndUpdate(data._id, { $inc: { nested: data.quantiy } }, { new: true })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async UpdateImport(data: any, session?: ClientSession): Promise<IProduct> {
    const set = {} as any
    const inc = {} as any
    if (data.priceImport) set.priceImport = data.priceImport
    if (data.quantity) inc.quantity = data.quantity

    const rs: IProduct = session ?
      await MProduct.findByIdAndUpdate(data._id, { $set: set, $inc: inc }, { session: session, new: true }) :
      await MProduct.findByIdAndUpdate(data._id, { $set: set, $inc: inc }, { new: true })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async UpdateExport(data: any, session?: ClientSession): Promise<IProduct> {
    const set = {} as any
    const inc = {} as any
    if (data.priceExport !== undefined) set.priceExport = data.priceExport
    if (data.quantity !== undefined) inc.quantity = data.quantity

    const rs: IProduct = session ?
      await MProduct.findByIdAndUpdate(data._id, { $set: set, $inc: inc }, { session: session, new: true }) :
      await MProduct.findByIdAndUpdate(data._id, { $set: set, $inc: inc }, { new: true })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }


  public async UpdateFlag(_id: Types.ObjectId, flag: boolean, session?: ClientSession): Promise<IProduct> {
    const rs: IProduct = session ?
      await MProduct.findByIdAndUpdate(_id, { $set: { flag: flag } }, { session: session, new: true }) :
      await MProduct.findByIdAndUpdate(_id, { $set: { flag: flag } }, { new: true })

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }

  public async Delete(_id: Types.ObjectId, session?: ClientSession): Promise<IProduct> {
    const rs: IProduct = session ?
      await MProduct.findByIdAndUpdate(_id, { session: session }) :
      await MProduct.findByIdAndUpdate(_id)

    if (!rs) throw new HttpException(409, "noExist")
    return rs
  }
}
