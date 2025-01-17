import { NextFunction, Request, Response } from 'express'
import { Container } from 'typedi'
import { MUser, IUser } from './model'
import { UserService } from './service'
import { HttpException } from '../../exceptions/http.exception'
import { RequestMiddlewares } from '../../interfaces/auth.interface'
import { getIp } from '../../utils/tm-request'
import mongoose from 'mongoose'

export class UserController {
  public user = Container.get(UserService)

  public get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      queries.page = queries.page ? parseInt(queries.page) : 1
      queries.rowsPerPage = queries.rowsPerPage ? parseInt(queries.rowsPerPage) : 10
      const rs = { data: [] as IUser[], rowsNumber: 0, status: false, message: 'find' }
      const conditions = { $and: [{ enable: queries.enable && queries.enable === 'true' ? true : false }] } as any
      if (queries.text) {
        conditions.$and.push({
          $or: [
            { email: new RegExp(queries.text, 'i') },
            { fullName: new RegExp(queries.text, 'i') },
            { personNumber: new RegExp(queries.text, 'i') },
            { phone: new RegExp(queries.text, 'i') }
          ]
        })
      }
      if (queries.group) conditions.$and.push({ group: queries.group })
      if (!queries.sortBy) queries.sortBy = 'username'
      rs.rowsNumber = (await MUser.countDocuments(conditions))
      rs.data = await this.user.FindAll(conditions)
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

  public find = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      if (queries._id) {
        // if (!mongoose.Types.ObjectId.isValid(queries._id)) return res.status(500).send('invalid')
        if (Array.isArray(queries._id)) {
          const rs = await this.user.FindAll({ _id: { $in: queries._id } }).exec()
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findById' })
        } else {
          const rs = await this.user.FindById(queries._id)
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findById' })
        }
      } else if (queries.email) {
        if (Array.isArray(queries.email)) {
          const rs = await this.user.FindOne({ email: { $in: queries.email } })
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findOneId' })
        } else {
          const rs = await this.user.FindOne({ email: queries.email })
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findOneId' })
        }
      } else if (queries.username) {
        if (Array.isArray(queries.username)) {
          const rs = await this.user.FindOne({ username: { $in: queries.username } })
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findOneId' })
        } else {
          const rs = await this.user.FindOne({ username: queries.username })
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
      const rs = { data: null as IUser, status: false, message: 'findOne' }
      const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.params.id)
      rs.data = await this.user.FindById(_id)
      if (rs.data) rs.status = true
      res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public findExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { data: null, status: false, message: 'findOne' }
      const queries = req.query as any
      rs.data = await MUser.exists({ username: queries.username })
      if (rs.data) rs.status = true
      res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public create = async (req: RequestMiddlewares, res: Response, next: NextFunction) => {
    try {
      const rs = { data: null as IUser, status: false, message: 'created' }
      const body: IUser = req.body
      body.created = { at: new Date(), by: req.verify._id.toString() || null, ip: getIp(req) }
      rs.data = await this.user.Create(body)
      if (rs.data) rs.status = true
      res.status(201).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { data: null as IUser, status: false, message: 'updated' }
      const body: IUser = req.body
      rs.data = await this.user.Update(body)
      if (rs.data) rs.status = true
      res.status(201).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { data: null as IUser, status: false, message: 'updated' }
      const body: IUser = req.body
      // Generate password
      const password = req.app.locals.configs.password_reset_default
      rs.data = await this.user.UpdatePassword(body._id, password, body.salt)
      if (rs.data) rs.status = true
      res.status(201).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { data: null as IUser, status: false, message: 'updated' }
      const body: IUser = req.body
      rs.data = await this.user.UpdatePassword(body._id, body.password, body.salt)
      if (rs.data) rs.status = true
      res.status(201).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { data: null as IUser, status: false, message: 'updated' }
      const body = req.body
      rs.data = await this.user.UpdateVerify(body._id, body.isVerify)
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
        session.startTransaction()
        try {
          for await (let obj of req.body) {
            const item = await this.user.UpdateFlag(new mongoose.Types.ObjectId(obj._id), obj.flag, session)
            if (!item) {
              rs.error.push(obj._id)
              next(new HttpException(401, 'updatedFlag'))
              break
            } else {
              rs.success.push(obj._id)
            }
          }
          // Commit the transaction
          await session.commitTransaction()
          rs.status = true
        } catch (error) {
          // Rollback the transaction in case of an error
          await session.abortTransaction()
        } finally {
          session.endSession()
          res.status(200).json(rs)
        }
        // const transaction = await session.withTransaction(async () => {
        //   for await (let obj of req.body.data) {
        //     try {
        //       const item = await this.user.UpdateFlag(obj._id, obj.flag, session)
        //       if (!item) {
        //         rs.error.push(obj._id)
        //         session.abortTransaction()
        //         break
        //       } else {
        //         rs.success.push(obj._id)
        //       }
        //     } catch (e) {
        //       rs.error.push(obj._id)
        //       session.abortTransaction()
        //       break
        //     }
        //   }
        // })
        // session.endSession()
        // if (transaction && transaction.ok) return res.status(203).json(rs)
        // else return res.status(200).json(rs)
      } else {
        const rs: IUser = await this.user.UpdateFlag(new mongoose.Types.ObjectId(body._id), body.flag)
        res.status(200).json({ data: rs, message: 'updatedFlag' })
      }
    } catch (error) {
      next(error)
    }
  }

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { data: null as IUser, status: false, message: 'deleted' }
      const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.params.id)
      rs.data = await this.user.Delete(_id)
      if (rs.data) rs.status = true
      res.status(201).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public import = async (req: RequestMiddlewares, res: Response, next: NextFunction) => {
    try {
      const body = req.body
      if (!req.body || !Array.isArray(body.data) || !req.body.length) next(new HttpException(404, 'noExist'))
      else {
        const rs = { success: [], error: [], status: false, message: 'import' }
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
          let i = 0
          for await (let obj of req.body.data) {
            obj.created = { at: new Date(), by: req.verify._id || undefined, ip: getIp(req) }
            // data.dateBirth = Moment(data.dateBirth, 'DD/MM/YYYY')
            const item = await this.user.Create(obj, session)
            if (!item) {
              rs.error.push(i)
              next(new HttpException(401, 'import'))
              break
            } else {
              rs.success.push(i)
            }
            i++
          }
          // Commit the transaction
          await session.commitTransaction()
          rs.status = true
        } catch (error) {
          // Rollback the transaction in case of an error
          await session.abortTransaction()
        } finally {
          session.endSession()
          res.status(200).json(rs)
        }
      }
    } catch (error) {
      next(error)
    }
  }
}
