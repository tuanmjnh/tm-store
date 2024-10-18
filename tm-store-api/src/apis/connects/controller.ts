import { NextFunction, Request, Response } from 'express'
import { Container } from 'typedi'
import { MConnect, IConnect } from './model'
import { ConnectService } from './service'
import { HttpException } from '@/exceptions/http.exception'
import { RequestMiddlewares } from '@/interfaces/auth.interface'
import { getIp } from '@/utils/tm-request'
import { googleOAuth2ByCode, authorize } from '@/services/google/auth'
import { jwtDecode } from 'jwt-decode'
import mongoose from 'mongoose'
const googleKey = { name: 'Google', key: 'google' }

export class ConnectController {
  public Connect = Container.get(ConnectService)

  public get = async (req: Request, res: Response, next: NextFunction) => {
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
      const rs = { data: [] as IConnect[], status: false, message: 'findConnect' }
      rs.data = await this.Connect.FindByKey(queries.key)
      if (rs.data) rs.status = true
      res.status(200).json(rs)
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

  public updateFlag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body
      if (body && Array.isArray(body)) {
        const rs = { success: [], error: [], status: false, message: 'updatedFlag' }
        const session = await mongoose.startSession()
        try {
          session.startTransaction()
          for await (let obj of req.body.data) {
            const item = await this.Connect.UpdateFlag(new mongoose.Types.ObjectId(obj._id), obj.flag, session)
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
        const rs: IConnect = await this.Connect.UpdateFlag(new mongoose.Types.ObjectId(body._id), body.flag)
        res.status(200).json({ data: rs, message: 'updatedFlag' })
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

  // Google OAuth
  public googleGetAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { data: null, status: false, message: this.googleGetAuth.name }
      const exist = await MConnect.findOne({ key: googleKey.key })
      if (!exist) next(new HttpException(404, 'noExist'))
      rs.data = await authorize(exist.credentials)
      res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public googleAuthByCode = async (req: RequestMiddlewares, res: Response, next: NextFunction) => {
    try {
      const body = req.body
      if (!body.code) next(new HttpException(404, 'noExistCode'))
      const rs = { data: null, status: false, message: this.googleAuthByCode.name }
      const credentials = await googleOAuth2ByCode(body.code)
      if (!credentials) return next(new HttpException(404, 'ErrorCode'))
      const exist = await MConnect.findOne({ key: googleKey.key })
      if (exist) {//Update
        rs.message = 'updateAuthGoogle'
        const params = {
          _id: exist._id,
          order: body.order || 1,
          clientID: body.clientID || null,
          credentials: credentials || null,
          authUri: null,
          redirectUris: null,
          profile: credentials && credentials.id_token ? jwtDecode(credentials.id_token) : null,
          config: null
        }
        const data = await this.Connect.Update(params)
        if (data) {
          rs.status = true
          rs.data = {
            _id: data._id,
            name: data.name,
            key: data.key,
            access_token: credentials.access_token,
            profile: data.profile,
            config: data.config,
            order: data.order,
            flag: data.flag,
            created: data.created
          }
        }
      } else {//Insert
        const params: IConnect = {
          name: googleKey.name,
          key: googleKey.key,
          order: body.order || 1,
          clientID: body.clientID || null,
          credentials: credentials || null,
          authUri: null,
          redirectUris: null,
          profile: credentials && credentials.id_token ? jwtDecode(credentials.id_token) : null,
          config: null,
          flag: 1,
          created: { at: new Date(), by: req.verify._id.toString() || null, ip: getIp(req) }
        }
        const data = await this.Connect.Create(params)
        if (data) {
          rs.status = true
          rs.data = {
            _id: data._id,
            name: data.name,
            key: data.key,
            access_token: credentials.access_token,
            profile: data.profile,
            config: data.config,
            order: data.order,
            flag: data.flag,
            created: data.created
          }
        }
      }
      res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public googleSetClientID = async (req: RequestMiddlewares, res: Response, next: NextFunction) => {
    try {
      const body = req.body
      if (!body.clientID) next(new HttpException(404, 'noExist'))
      const rs = { data: null, status: false, message: this.googleSetClientID.name }
      const exist = await MConnect.findOne({ key: googleKey.key })
      if (exist) {//Update
        rs.message = 'updateAuthGoogle'
        const data = await this.Connect.Update({ _id: exist._id, clientID: body.clientID })
        if (data) {
          rs.status = true
          rs.data = {
            _id: data._id,
            name: data.name,
            key: data.key,
            clientID: data.clientID,
            config: data.config,
            order: data.order,
            flag: data.flag,
            created: data.created
          }
        }
      } else {//Insert
        const params: IConnect = {
          name: googleKey.name,
          key: googleKey.key,
          order: body.order || 1,
          clientID: body.clientID || null,
          credentials: null,
          authUri: null,
          redirectUris: null,
          profile: null,
          config: null,
          flag: 1,
          created: { at: new Date(), by: req.verify._id.toString() || null, ip: getIp(req) }
        }
        const data = await this.Connect.Create(params)
        if (data) {
          rs.status = true
          rs.data = {
            _id: data._id,
            name: data.name,
            key: data.key,
            clientID: data.clientID,
            config: data.config,
            order: data.order,
            flag: data.flag,
            created: data.created
          }
        }
      }
      res.status(201).json(rs)
    } catch (error) {
      next(error)
    }
  }
  public googleRemoveClientID = async (req: RequestMiddlewares, res: Response, next: NextFunction) => {
    try {
      const body = req.body
      if (!body.clientID) next(new HttpException(404, 'noExist'))
      const rs = { data: null, status: false, message: this.googleSetClientID.name }
      const exist = await MConnect.findOne({ key: googleKey.key })
      if (exist) {//Update
        rs.message = 'updateAuthGoogle'
        const data = await this.Connect.Update({ clientID: null, credentials: null })
        if (data) rs.status = true
      } else {//Insert
        const params: IConnect = {
          name: googleKey.name,
          key: googleKey.key,
          order: body.order || 1,
          clientID: body.clientID || null,
          credentials: null,
          authUri: null,
          redirectUris: null,
          profile: null,
          config: null,
          flag: 1,
          created: { at: new Date(), by: req.verify._id.toString() || null, ip: getIp(req) }
        }
        const data = await this.Connect.Create(params)
        if (data) rs.status = true
      }
      res.status(201).json(rs)
    } catch (error) {
      next(error)
    }
  }
}
