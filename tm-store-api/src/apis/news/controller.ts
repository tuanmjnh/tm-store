import { NextFunction, Request, Response } from 'express'
import { Container } from 'typedi'
import { MNews, INews } from './model'
import { NewsService } from './service'
import { HttpException } from '../../exceptions/http.exception'
import { RequestMiddlewares } from '../../interfaces/auth.interface'
import { getIp } from '../../utils/tm-request'
import { getPagination } from '../../utils/tm-pagination'
import { NewGuid } from '../../utils/tm-crypto'
import mongoose from 'mongoose'

export class NewsController {
  public news = Container.get(NewsService)

  public get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      queries.page = queries.page ? parseInt(queries.page) : 1
      queries.rowsPerPage = queries.rowsPerPage ? parseInt(queries.rowsPerPage) : 10
      const rs = { data: [] as INews[], rowsNumber: 0, status: false, message: 'find' }
      let conditions = { $and: [{ flag: queries.flag ? parseInt(queries.flag) : 1 }] } as any
      if (queries.filter) conditions.$and.push({ $text: { $search: queries.filter } })
      if (queries.group) conditions.$and.push({ group: queries.group })
      if (!queries.sortBy) queries.sortBy = 'order'

      if (queries.filter) {
        conditions.$and = []
        conditions.$and.push({
          $or: [
            { title: new RegExp(queries.filter, 'i') }
          ]
        })
      }
      if (!queries.sortBy) queries.sortBy = 'order'
      rs.rowsNumber = (await MNews.countDocuments(conditions))
      rs.data = await this.news.FindAll(conditions)
        .skip((parseInt(queries.page) - 1) * parseInt(queries.rowsPerPage))
        .limit(parseInt(queries.rowsPerPage))
        .sort({ [queries.sortBy]: queries.descending === 'true' ? -1 : 1 }) // 1 ASC, -1 DESC
        .exec()
      // return res.status(200).json(rs)
      if (rs.data) rs.status = true
      res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      const rs = { data: [] as INews[], status: false, message: 'getAll' }
      rs.data = await this.news.FindAll({ flag: queries.flag ? parseInt(queries.flag) : 1 })
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
          const rs = await this.news.FindAll({ _id: { $in: queries._id } }).exec()
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findById' })
        } else {
          const rs = await this.news.FindById(queries._id)
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findById' })
        }
      } else if (queries.code) {
        if (Array.isArray(queries.code)) {
          const rs = await this.news.FindAll({ code: { $in: queries.code.toUpperCase() } })
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findOneId' })
        } else {
          const rs = await this.news.FindOne({ code: queries.code })
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
      const rs = { data: null as INews, status: false, message: 'findOne' }
      const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.params.id)
      rs.data = await this.news.FindById(_id)
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
      rs.data = await MNews.exists({ code: queries.code.toUpperCase() })
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
      rs.data = await MNews.distinct(queries.key ? 'attr.key' : 'attr.value', conditions)
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
      rs.data = await MNews.distinct(queries.key ? 'meta.key' : 'meta.value', conditions)
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
      const body: INews = req.body
      const rs = { data: null as INews, status: false, message: 'created' }
      body.created = { at: new Date(), by: req.verify._id.toString() || null, ip: getIp(req) }
      rs.data = await this.news.Create(body)
      if (rs.data) rs.status = true
      res.status(201).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public copy = async (req: RequestMiddlewares, res: Response, next: NextFunction) => {
    try {
      const body: INews = req.body
      const rs = { data: null as INews, status: false, message: 'copy' }
      body.code = NewGuid().split('-')[0]
      body.flag = 0
      body.title = `${req.body.data.title} - duplicate`
      if (req.body.data._id) delete body._id
      body.created = { at: new Date(), by: req.verify._id.toString() || null, ip: getIp(req) }
      rs.data = await this.news.Create(body)
      if (rs.data) rs.status = true
      res.status(201).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: INews = req.body
      const rs = { data: null as INews, status: false, message: 'updated' }
      rs.data = await this.news.Update(body)
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
            const item = await this.news.UpdateFlag(new mongoose.Types.ObjectId(obj._id), obj.flag, session)
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
        const rs: INews = await this.news.UpdateFlag(new mongoose.Types.ObjectId(body._id), body.flag)
        res.status(200).json({ data: rs, message: 'updatedFlag' })
      }
    } catch (error) {
      next(error)
    }
  }

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { data: null as INews, status: false, message: 'deleted' }
      const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.params.id)
      rs.data = await this.news.Delete(_id)
      if (rs.data) rs.status = true
      res.status(201).json(rs)
    } catch (error) {
      next(error)
    }
  }
}
