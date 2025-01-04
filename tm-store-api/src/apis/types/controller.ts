import { NextFunction, Request, Response } from 'express'
import { Container } from 'typedi'
import { MType, IType } from './model'
import { TypeService } from './service'
import { HttpException } from '../../exceptions/http.exception'
import { RequestMiddlewares } from '../../interfaces/auth.interface'
import { getIp } from '../..//utils/tm-request'
import { getPagination } from '../../utils/tm-pagination'
import { NewGuid } from '../../utils/tm-crypto'
import mongoose from 'mongoose'

export class TypeController {
  public type = Container.get(TypeService)

  public get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      queries.page = queries.page ? parseInt(queries.page) : 1
      queries.rowsPerPage = queries.rowsPerPage ? parseInt(queries.rowsPerPage) : 10
      const rs = { data: [] as IType[], rowsNumber: 0, status: false, message: 'find' }
      const conditions = { $and: [{ flag: queries.flag ? parseInt(queries.flag) : 1 }] } as any
      if (queries.key) conditions.$and.push({ key: queries.key })
      if (queries.text) {
        // conditions.$and = []
        conditions.$and.push({
          $or: [
            { key: new RegExp(queries.text, 'i') },
            { name: new RegExp(queries.text, 'i') }
          ]
        })
      }
      if (!queries.sortBy) queries.sortBy = 'order'
      rs.rowsNumber = (await MType.countDocuments(conditions))
      rs.data = await this.type.FindAll(conditions)
        .skip((parseInt(queries.page) - 1) * parseInt(queries.rowsPerPage))
        .limit(parseInt(queries.rowsPerPage))
        .sort({ [queries.sortBy]: queries.descending === 'true' ? -1 : 1 }) // 1 ASC, -1 DESC
        .exec()
      // rs.data = rs.data.sort(function (a, b) { return a.order - b.order })
      if (rs.data) rs.status = true
      res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      const rs = { data: [] as IType[], status: false, message: 'getAll' }
      rs.data = await this.type.FindAll({ flag: queries.flag ? parseInt(queries.flag) : 1 })
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
          const rs = await this.type.FindAll({ _id: { $in: queries._id } }).exec()
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findById' })
        } else {
          const rs = await this.type.FindById(queries._id)
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findById' })
        }
      } else if (queries.key) {
        if (Array.isArray(queries.key)) {
          const rs = await this.type.FindAll({ key: { $in: queries.key } })
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findOneId' })
        } else {
          const rs = await this.type.FindOne({ key: queries.key })
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findOneId' })
        }
      }
    } catch (error) {
      next(error)
    }
  }

  public findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { data: null as IType, status: false, message: 'findOne' }
      const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.params.id)
      rs.data = await this.type.FindById(_id)
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
      rs.data = await MType.exists({ key: queries.key })
      if (rs.data) rs.status = true
      res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public getKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      const rs = { data: [] as Array<string>, status: false, message: 'getKey' }
      rs.data = await MType.distinct('key', { key: new RegExp(queries.filter, 'i') })
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
      rs.data = await MType.distinct(queries.key ? 'meta.key' : 'meta.value', conditions)
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
      const body: IType = req.body
      const rs = { data: null as IType, status: false, message: 'created' }
      body.created = { at: new Date(), by: req.verify._id.toString() || null, ip: getIp(req) }
      rs.data = await this.type.Create(body)
      if (rs.data) rs.status = true
      res.status(201).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public copy = async (req: RequestMiddlewares, res: Response, next: NextFunction) => {
    try {
      const body: IType = req.body
      const rs = { data: null as IType, status: false, message: 'copy' }
      body.code = NewGuid().split('-')[0]
      body.flag = 0
      body.name = `${req.body.data.name} - duplicate`
      if (req.body.data._id) delete body._id
      body.created = { at: new Date(), by: req.verify._id.toString() || null, ip: getIp(req) }
      rs.data = await this.type.Create(body)
      if (rs.data) rs.status = true
      res.status(201).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: IType = req.body
      const rs = { data: null as IType, status: false, message: 'updated' }
      rs.data = await this.type.Update(body)
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
            const item = await this.type.UpdateFlag(new mongoose.Types.ObjectId(obj._id), obj.flag, session)
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
        const rs: IType = await this.type.UpdateFlag(new mongoose.Types.ObjectId(body._id), body.flag)
        res.status(200).json({ data: rs, status: true, message: 'updatedFlag' })
      }
    } catch (error) {
      next(error)
    }
  }

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { data: null as IType, status: false, message: 'deleted' }
      const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.params.id)
      rs.data = await this.type.Delete(_id)
      if (rs.data) rs.status = true
      res.status(201).json(rs)
    } catch (error) {
      next(error)
    }
  }
}
