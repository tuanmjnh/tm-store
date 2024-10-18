import { NextFunction, Request, Response } from 'express'
import { Container } from 'typedi'
import { MProduct, IProduct } from './model'
import { ProductService } from './service'
import { HttpException } from '@/exceptions/http.exception'
import { RequestMiddlewares } from '@/interfaces/auth.interface'
import mongoose from 'mongoose'
import { getIp } from '@/utils/tm-request'
import { getPagination } from '@utils/tm-pagination'
import { NewGuid } from '@/utils/tm-crypto'

export class ProductController {
  public product = Container.get(ProductService)

  public get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      queries.page = queries.page ? parseInt(queries.page) : 1
      queries.rowsPerPage = queries.rowsPerPage ? parseInt(queries.rowsPerPage) : 10
      const rs = { data: [] as IProduct[], rowsNumber: 0, status: false, message: 'find' }
      const conditions = { $and: [{ flag: queries.flag ? parseInt(queries.flag) : 1 }] } as any
      if (queries.filter) conditions.$and.push({ $text: { $search: queries.filter } })
      if (!queries.sortBy) queries.sortBy = 'order'
      rs.rowsNumber = (await MProduct.countDocuments(conditions))

      if (queries.group) conditions.$and.push({ group: { $in: [queries.group] } })
      if (queries.quantity !== undefined) conditions.$and.push({ quantity: { $gt: parseInt(queries.quantity) } })

      rs.data = await this.product.FindAll(conditions)
        .skip((parseInt(queries.page) - 1) * parseInt(queries.rowsPerPage))
        .limit(parseInt(queries.rowsPerPage))
        .sort({ [queries.sortBy]: queries.descending === 'true' ? -1 : 1 }) // 1 ASC, -1 DESC
        .exec()
      if (rs.data) rs.status = true
      res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      const rs = { data: [] as IProduct[], status: false, message: 'getAll' }
      rs.data = await this.product.FindAll({ flag: queries.flag ? parseInt(queries.flag) : 1 })
      if (rs.data) rs.status = true
      res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public find = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      if (queries._id) {
        if (Array.isArray(queries._id)) {
          const rs = await this.product.FindAll({ _id: { $in: queries._id } }).exec()
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findById' })
        } else {
          const rs = await this.product.FindById(queries._id)
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findById' })
        }
      } else if (queries.code) {
        if (Array.isArray(queries.code)) {
          const rs = await this.product.FindAll({ code: { $in: queries.code.toUpperCase() } })
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findOneId' })
        } else {
          const rs = await this.product.FindOne({ code: queries.code })
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findOneId' })
        }
      } else if (queries.qrcode) {
        if (Array.isArray(queries.code)) {
          const conditions = { $or: [{ qrcode: { $in: queries.qrcode } }, { barcode: { $in: queries.qrcode } }] }
          const rs = await this.product.FindAll(conditions)
          if (!rs) return res.status(404).send('no_exist')
          return res.status(200).json(rs)
        } else {
          const conditions = { $or: [{ qrcode: queries.qrcode }, { barcode: queries.qrcode }] }
          const rs = await this.product.FindOne(conditions)
          if (!rs) return res.status(404).send('no_exist')
          return res.status(200).json(rs[0])
        }
      }
    } catch (error) {
      next(error)
    }
  }

  public findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { data: null as IProduct, status: false, message: 'findOne' }
      const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.params.id)
      rs.data = await this.product.FindById(_id)
      if (rs.data) rs.status = true
      res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public findExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      const rs = { data: null, status: false, message: 'findExist' }
      rs.data = await MProduct.exists({ code: queries.code.toUpperCase() })
      if (rs.data) rs.status = true
      res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public getAttr = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      const rs = { data: [], rowsNumber: 0, status: false, message: 'getAttr' }
      const conditions = queries.key ? { 'attr.key': new RegExp(queries.filter, 'i') } : { 'attr.value': new RegExp(queries.filter, 'i') }
      rs.data = await MProduct.distinct(queries.key ? 'attr.key' : 'attr.value', conditions)
      rs.rowsNumber = rs.data.length
      if (rs.data) rs.status = true
      if (queries.page && queries.rowsPerPage) res.status(200).json(getPagination(rs, parseInt(queries.page), parseInt(queries.rowsPerPage)))
      else res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }


  public getMeta = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      const rs = { data: [], rowsNumber: 0, status: false, message: 'getMeta' }
      const conditions = queries.key ? { 'meta.key': new RegExp(queries.filter, 'i') } : { 'meta.value': new RegExp(queries.filter, 'i') }
      rs.data = await MProduct.distinct(queries.key ? 'meta.key' : 'meta.value', conditions)
      rs.rowsNumber = rs.data.length
      if (rs.data) rs.status = true
      if (queries.page && queries.rowsPerPage) res.status(200).json(getPagination(rs, parseInt(queries.page), parseInt(queries.rowsPerPage)))
      else res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public create = async (req: RequestMiddlewares, res: Response, next: NextFunction) => {
    try {
      const body: IProduct = req.body
      const rs = { data: null as IProduct, status: false, message: 'created' }
      body.created = { at: new Date(), by: req.verify._id.toString() || null, ip: getIp(req) }
      rs.data = await this.product.Create(body)
      if (rs.data) rs.status = true
      res.status(201).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public copy = async (req: RequestMiddlewares, res: Response, next: NextFunction) => {
    try {
      const body: IProduct = req.body
      const rs = { data: null as IProduct, status: false, message: 'copy' }
      body.code = NewGuid().split('-')[0]
      body.flag = 0
      body.title = `${req.body.data.title} - duplicate`
      if (req.body.data._id) delete body._id
      body.created = { at: new Date(), by: req.verify._id.toString() || null, ip: getIp(req) }
      rs.data = await this.product.Create(body)
      if (rs.data) rs.status = true
      res.status(201).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: IProduct = req.body
      const rs = { data: null as IProduct, status: false, message: 'updated' }
      rs.data = await this.product.Update(body)
      if (rs.data) rs.status = true
      res.status(201).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public updateFlag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body
      if (body && Array.isArray(body)) {
        const rs = { success: [], error: [], status: false, message: 'updatedFlag' }
        const session = await mongoose.startSession()
        try {
          session.startTransaction()
          for await (let obj of req.body) {
            const item = await this.product.UpdateFlag(new mongoose.Types.ObjectId(obj._id), obj.flag, session)
            if (!item) {
              rs.error.push(obj._id)
              next(new HttpException(401, 'updatedFlag'))
              break
            } else {
              rs.success.push(obj._id)
            }
          }
          await session.commitTransaction() // commit transaction and session
          rs.status = true
        } catch (error) {
          await session.abortTransaction()// abort transaction and session
        } finally {
          session.endSession()
          res.status(200).json(rs)
        }
      } else {
        const rs: IProduct = await this.product.UpdateFlag(new mongoose.Types.ObjectId(body._id), body.flag)
        res.status(200).json({ data: rs, status: true, message: 'updatedFlag' })
      }
    } catch (error) {
      next(error)
    }
  }

  public import = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
      next(error)
    }
  }

  //   module.exports.import = async function (req, res, next) {
  //   const rs = { success: [], error: [], text: '' }
  //   try {
  //     // Check type and data
  //     if (!req.body || !req.body.type || !req.body.data) return res.status(404).send('invalid')
  //     if (!req.body.data.length) return res.status(404).send('notExist')
  //     // Declare result
  //     const session = await mongoose.startSession()
  //     const transaction = await session.withTransaction(async () => {
  //       for await (const e of req.body.data) {
  //         if (!e.code) {
  //           rs.error.push({ code: null, txt: 'invalidCode' })
  //           await session.abortTransaction()
  //           break
  //         }
  //         if (req.body.type === 'p') {
  //           // check exist code
  //           const exist = await AProducts.findOne({ code: e.code }).session(session)
  //           if (exist) {
  //             rs.error.push({ code: e.code, txt: 'existed' })
  //             continue
  //           }
  //           // insert
  //           const insert = await AProducts.insert(req, e, null, session)
  //           if (!insert) {
  //             rs.error.push({ code: e.code, txt: 'invalid' })
  //             await session.abortTransaction()
  //             break
  //           } else rs.success.push({ code: e.code, txt: 'inserted' })
  //           Logger.set(req, AProducts.name, insert._id, 'insert') // Set Log
  //         } else if (req.body.type === 't') {
  //           const exist = await AProducts.findOne({ code: e.code }).session(session)
  //           if (!exist) rs.error.push({ index: e.index, code: e.code, txt: 'notExist' })
  //           if (exist.types && exist.types.length) {
  //             // console.log(exist.types[0].label, exist.types[0].options, exist.typeData)
  //             let optionId = null
  //             if (exist.types.length > 0) {
  //               if (e.codeType1) {
  //                 e.codeType1 = e.codeType1.trim()
  //                 if (!exist.types[0].options.find(x => x.label.toUpperCase() === e.codeType1.toUpperCase())) {
  //                   const option = { id: Helpers.generatorIdType(exist.types[0].options), label: e.codeType1 }
  //                   exist.types[0].options.push(option)
  //                   exist.typeData[option.id] = new productType.TypeData(e.price, e.priceImport)
  //                   optionId = option.id
  //                 }
  //               } else {
  //                 rs.error.push({ index: e.index, code: e.code, txt: 'codeType1' })
  //                 await session.abortTransaction()
  //                 break
  //               }
  //             }
  //             if (exist.types.length > 1) {
  //               if (e.codeType2) {
  //                 e.codeType2 = e.codeType2.trim()
  //                 const existType2 = exist.types[1].options.find(x => x.label.toUpperCase() === e.codeType2.toUpperCase())
  //                 if (!existType2) {
  //                   const option = { id: Helpers.generatorIdType(exist.types[1].options), label: e.codeType2 }
  //                   exist.types[1].options.push(option)
  //                   const newTypeData = {}
  //                   newTypeData[option.id] = { ...exist.typeData[optionId] }
  //                   exist.typeData[optionId] = newTypeData
  //                 } else {
  //                   const newTypeData = {}
  //                   newTypeData[existType2.id] = { ...exist.typeData[optionId] }
  //                   exist.typeData[optionId] = newTypeData
  //                 }
  //                 // Fix null types
  //                 exist.types[0].options.forEach(op => {
  //                   exist.types[1].options.forEach(sop => {
  //                     if (!exist.typeData[op.id][sop.id]) exist.typeData[op.id][sop.id] = new productType.TypeData()
  //                   })
  //                 })
  //               } else {
  //                 rs.error.push({ index: e.index, code: e.code, txt: 'codeType2' })
  //                 await session.abortTransaction()
  //                 break
  //               }
  //             }
  //           } else {
  //             if (e.nameType1 && e.codeType1) {
  //               exist.types = []
  //               exist.typeData = {}
  //               const options = []
  //               const option = { id: 1, label: e.codeType1.trim() }
  //               options.push(option)
  //               exist.types.push({ label: e.nameType1.trim(), options })
  //               exist.typeData[option.id] = new productType.TypeData(e.price, e.priceImport)
  //             } else {
  //               // Update Price and Price Import for item none types
  //               exist.price = e.price
  //               exist.priceImport = e.priceImport
  //               const update = await AProducts.update(req, { _id: exist._id, price: exist.price, priceImport: exist.priceImport }, session)
  //               // console.log(update)
  //               if (!update.modifiedCount || !update.matchedCount) rs.success.push({ code: e.code, txt: 'update' })
  //               else {
  //                 rs.error.push({ index: e.index, code: e.code, txt: 'update' })
  //                 await session.abortTransaction()
  //                 break
  //               }
  //               continue
  //               // rs.error.push({ index: e.index, code: e.code, txt: 'nameType1' })
  //               // await session.abortTransaction()
  //               // break
  //             }
  //             // console.log(exist.types, exist.typeData)
  //             if (e.nameType2 && e.codeType2) {
  //               const options = []
  //               const option = { id: 1, label: e.codeType2.trim() }
  //               options.push(option)
  //               exist.types.push({ label: e.nameType2.trim(), options })
  //               exist.typeData[option.id] = { ...exist.typeData }
  //             }// else rs.error.push({ index: e.index, code: e.code, txt: 'nameType2' })
  //           }
  //           const update = await AProducts.updateType(exist, session)
  //           if (!update.modifiedCount) {
  //             rs.error.push({ index: e.index, code: e.code, txt: 'update' })
  //             await session.abortTransaction()
  //             break
  //           } else rs.success.push({ code: e.code, txt: 'update' })
  //           // console.log(exist.types[0].label, exist.types[0].options, exist.typeData)
  //           Logger.set(req, AProducts.name, exist._id, 'update') // Set Log
  //         } else {
  //           rs.error.push({ index: e.index, code: e.code, txt: 'type' })
  //           await session.abortTransaction()
  //           break
  //         }
  //       }
  //     })
  //     session.endSession()
  //     if (transaction && transaction.ok) return res.status(201).json(rs)
  //     else return res.status(200).json(rs)
  //   } catch (e) {
  //     // console.log(e)
  //     rs.text = 'invalid'
  //     return res.status(500).json(rs)
  //   }
  // }

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { data: null as IProduct, status: false, message: 'deleted' }
      const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.params.id)
      rs.data = await this.product.Delete(_id)
      if (rs.data) rs.status = true
    } catch (error) {
      next(error)
    }
  }
}
