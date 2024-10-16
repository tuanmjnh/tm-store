import { NextFunction, Request, Response } from 'express'
import { Container } from 'typedi'
import { MConnect, IConnect } from './model'
import { ConnectService } from './service'
import { HttpException } from '@/exceptions/http.exception'
import { RequestMiddlewares } from '@/interfaces/auth.interface'
import mongoose from 'mongoose'
import { getIp } from '@/utils/tm-request'

export class ConnectController {
  public Connect = Container.get(ConnectService)

  public get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      queries.page = queries.page ? parseInt(queries.page) : 1
      queries.rowsPerPage = queries.rowsPerPage ? parseInt(queries.rowsPerPage) : 10
      const rs = { data: [] as IConnect[], rowsNumber: 0, status: false, message: 'find' }
      const conditions = { $and: [{ flag: queries.flag ? parseInt(queries.flag) : 1 }] } as any
      if (queries.filter) {
        conditions.$and = []
        conditions.$and.push({
          $or: [
            { key: new RegExp(queries.filter, 'i') },
            { name: new RegExp(queries.filter, 'i') }
          ]
        })
      }
      if (!queries.sortBy) queries.sortBy = 'order'
      rs.rowsNumber = (await MConnect.countDocuments(conditions))
      rs.data = await this.Connect.FindAll(conditions)
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
      const rs = { data: [] as IConnect[], status: false, message: 'getAll' }
      rs.data = await this.Connect.FindAll({ flag: queries.flag ? parseInt(queries.flag) : 1 })
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
          const rs = await this.Connect.FindAll({ _id: { $in: queries._id } }).exec()
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findById' })
        } else {
          const rs = await this.Connect.FindById(queries._id)
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findById' })
        }
      } else if (queries.key) {
        if (Array.isArray(queries.key)) {
          const rs = await this.Connect.FindAll({ key: { $in: queries.key } })
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findOneId' })
        } else {
          const rs = await this.Connect.FindOne({ key: queries.key })
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
      const rs = { data: null as IConnect, status: false, message: 'findOne' }
      const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.params.id)
      rs.data = await this.Connect.FindById(_id)
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
      rs.data = await MConnect.exists({ key: queries.key })
      if (rs.data) rs.status = true
      res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public create = async (req: RequestMiddlewares, res: Response, next: NextFunction) => {
    try {
      const body: IConnect = req.body
      const rs = { data: null as IConnect, status: false, message: 'created' }
      body.created = { at: new Date(), by: req.verify._id.toString() || null, ip: getIp(req) }
      rs.data = await this.Connect.Create(body)
      if (rs.data) rs.status = true
      res.status(201).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: IConnect = req.body
      const rs = { data: null as IConnect, status: false, message: 'updated' }
      rs.data = await this.Connect.Update(body)
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
        const rs = { success: [], error: [], status: false, message: 'updated' }
        const session = await mongoose.startSession()
        try {
          session.startTransaction()
          for await (let obj of req.body.data) {
            const item = await this.Connect.UpdateFlag(new mongoose.Types.ObjectId(obj._id), obj.flag, session)
            if (!item) {
              rs.error.push(obj._id)
              next(new HttpException(401, 'update'))
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
        const rs: IConnect = await this.Connect.UpdateFlag(new mongoose.Types.ObjectId(body._id), body.flag)
        res.status(200).json({ data: rs, message: 'updated' })
      }
    } catch (error) {
      next(error)
    }
  }

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { data: null as IConnect, status: false, message: 'deleted' }
      const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.params.id)
      rs.data = await this.Connect.Delete(_id)
      if (rs.data) rs.status = true
      res.status(201).json(rs)
    } catch (error) {
      next(error)
    }
  }
}