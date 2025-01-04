import { NextFunction, Request, Response } from 'express'
import { Container } from 'typedi'
import { MConfig, IConfig } from './model'
import { ConfigService } from './service'
import { HttpException } from '../../exceptions/http.exception'
import { RequestMiddlewares } from '../../interfaces/auth.interface'
import { NewGuid } from '../../utils/tm-crypto'
import { getIp } from '../../utils/tm-request'
import mongoose from 'mongoose'

export class ConfigController {
  public config = Container.get(ConfigService)

  public get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      queries.page = queries.page ? parseInt(queries.page) : 1
      queries.rowsPerPage = queries.rowsPerPage ? parseInt(queries.rowsPerPage) : 10
      const rs = { data: [] as IConfig[], rowsNumber: 0, status: false, message: 'find' }
      const conditions = {} as any
      if (queries.text) {
        conditions.$and = []
        conditions.$and.push({
          $or: [
            { key: new RegExp(queries.text, 'i') },
            { value: new RegExp(queries.text, 'i') }
          ]
        })
      }
      conditions.$and.push({ level: queries.level || 1 })
      if (!queries.sortBy) queries.sortBy = 'key'
      rs.rowsNumber = (await MConfig.countDocuments(conditions))
      rs.data = await this.config.FindAll(conditions)
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
      const rs = { data: [] as IConfig[], status: false, message: 'getAll' }
      rs.data = await this.config.FindAll({ level: 1 })
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
          const rs = await this.config.FindAll({ _id: { $in: queries._id } }).exec()
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findById' })
        } else {
          const rs = await this.config.FindById(queries._id)
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findById' })
        }
      } else if (queries.key) {
        if (Array.isArray(queries.key)) {
          const rs = await this.config.FindAll({ key: { $in: queries.key } })
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findOneId' })
        } else {
          const rs = await this.config.FindOne({ key: queries.key })
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
      const rs = { data: null as IConfig, status: false, message: 'findOne' }
      const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.params.id)
      rs.data = await this.config.FindById(_id)
      if (rs.data) rs.status = true
    } catch (error) {
      next(error)
    }
  }

  public findExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      const rs = { data: null, status: false, message: 'findExist' }
      rs.data = await MConfig.exists({ key: queries.key })
      if (rs.data) rs.status = true
      res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public create = async (req: RequestMiddlewares, res: Response, next: NextFunction) => {
    try {
      const body: IConfig = req.body
      const rs = { data: null as IConfig, status: false, message: 'created' }
      body.created = { at: new Date(), by: req.verify._id.toString() || null, ip: getIp(req) }
      rs.data = await this.config.Create(body)
      if (rs.data) rs.status = true
      res.status(201).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public copy = async (req: RequestMiddlewares, res: Response, next: NextFunction) => {
    try {
      const body: IConfig = req.body
      const rs = { data: null as IConfig, status: false, message: 'copy' }
      body.key = NewGuid().split('-')[0]
      body.flag = 0
      body.value = `${req.body.data.value} - duplicate`
      if (req.body.data._id) delete body._id
      body.created = { at: new Date(), by: req.verify._id.toString() || null, ip: getIp(req) }
      rs.data = await this.config.Create(body)
      if (rs.data) rs.status = true
      res.status(201).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: IConfig = req.body
      const rs = { data: null as IConfig, status: false, message: 'updated' }
      rs.data = await this.config.Update(body)
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
            const item = await this.config.UpdateFlag(new mongoose.Types.ObjectId(obj._id), obj.flag, session)
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
        const rs: IConfig = await this.config.UpdateFlag(new mongoose.Types.ObjectId(body._id), body.flag)
        res.status(200).json({ data: rs, message: 'updatedFlag' })
      }
    } catch (error) {
      next(error)
    }
  }

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { data: null as IConfig, status: false, message: 'deleted' }
      const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.params.id)
      rs.data = await this.config.Delete(_id)
      if (rs.data) rs.status = true
      res.status(201).json(rs)
    } catch (error) {
      next(error)
    }
  }
}
