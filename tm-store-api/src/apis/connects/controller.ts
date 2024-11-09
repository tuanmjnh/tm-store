import { NextFunction, Request, Response } from 'express'
import { Container } from 'typedi'
import { MConnect, IConnect } from './model'
import { ConnectService } from './service'
import { HttpException } from '@/exceptions/http.exception'
import { RequestMiddlewares } from '@/interfaces/auth.interface'
import { getIp } from '@/utils/tm-request'
import { googleOAuth2ByCode, refreshAccessToken, verifyIdToken } from '@/services/google/auth'
import { jwtDecode } from 'jwt-decode'
import mongoose from 'mongoose'
import { getUrl } from '@/utils/tm-url'
const CONNECTS = {
  google: { name: 'Google', key: 'google' }
}

export class ConnectController {
  public Connect = Container.get(ConnectService)

  public get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      const rs = { data: [] as IConnect[], status: false, message: this.get.name }
      const data = await this.Connect.FindAll({ flag: queries.flag ? parseInt(queries.flag) : 1 })
      if (rs.data) rs.status = true
      res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public find = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      const rs = { data: [] as IConnect[], status: false, message: this.find.name }
      rs.data = await this.Connect.FindAll({ key: queries.key })
      if (rs.data) rs.status = true
      res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { data: null as IConnect, status: false, message: this.findById.name }
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
      const rs = { data: null, status: false, message: this.findExist.name }
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
        const rs = { success: [], error: [], status: false, message: this.updateFlag.name }
        const session = await mongoose.startSession()
        try {
          session.startTransaction()
          for await (let obj of req.body.data) {
            const item = await this.Connect.UpdateFlag(new mongoose.Types.ObjectId(obj._id), obj.flag, session)
            if (!item) {
              rs.error.push(obj._id)
              next(new HttpException(401, this.updateFlag.name))
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
        res.status(200).json({ data: rs, message: this.updateFlag.name })
      }
    } catch (error) {
      next(error)
    }
  }

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { data: null as IConnect, status: false, message: this.delete.name }
      const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.params.id)
      rs.data = await this.Connect.Delete(_id)
      if (rs.data) rs.status = true
      res.status(201).json(rs)
    } catch (error) {
      next(error)
    }
  }

  // Google OAuth
  private googleDataReturn = (data: IConnect) => {
    return {
      _id: data._id,
      name: data.name,
      key: data.key,
      access_token: data.credentials && data.credentials.access_token ? data.credentials.access_token : null,
      profile: {
        email: data.profile?.email,
        email_verified: data.profile?.email_verified,
        name: data.profile?.name,
        picture: data.profile?.picture,
        given_name: data.profile?.given_name,
        family_name: data.profile?.family_name,
        iat: data.profile?.iat,
        exp: data.profile?.exp
      },
      config: data.config,
      order: data.order,
      flag: data.flag,
      created: data.created
    }
  }
  public googleVerifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      if (!queries.access_token) next(new HttpException(404, 'noExistAccessToken'))
      const rs = { data: null, status: false, message: this.googleVerifyToken.name }
      const exist = await this.Connect.FindByKey(CONNECTS.google.key)
      if (!exist) return res.status(200).json(rs)
      if (!exist.credentials) {
        rs.data = this.googleDataReturn(exist)
        return res.status(200).json(rs)
      }
      const redirectUri = `${getUrl(req.get('Referrer')).origin}/connect/google-add`
      exist.credentials.access_token = queries.access_token
      const ticket = await verifyIdToken(exist.credentials, exist.redirectUris && exist.redirectUris.length ? exist.redirectUris[0] : redirectUri)
      console.log(ticket)
      if (ticket) {
        rs.status = true
        // rs.data = this.googleDataReturn(ticket)
      }
      res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }
  public googleGetAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { data: null, status: false, message: this.googleGetAuth.name }
      const exist = await this.Connect.FindByKey(CONNECTS.google.key)
      if (!exist) return res.status(200).json(rs)
      if (!exist.credentials) {
        rs.data = this.googleDataReturn(exist)
        return res.status(200).json(rs)
      }
      const redirectUri = `${getUrl(req.get('Referrer')).origin}/connect/google-add`
      const credentials = await refreshAccessToken(exist.credentials, exist.redirectUris && exist.redirectUris.length ? exist.redirectUris[0] : redirectUri)
      if (!credentials) return next(new HttpException(404, 'ErrorCode'))
      exist.credentials.access_token = credentials.access_token
      exist.credentials.expiry_date = credentials.expiry_date
      exist.credentials.scope = credentials.scope
      exist.credentials.token_type = credentials.token_type
      const data = await this.Connect.Update({
        _id: exist._id,
        credentials: exist.credentials,
        // profile: credentials && credentials.id_token ? jwtDecode(credentials.id_token) : null
      })
      if (data) {
        rs.status = true
        rs.data = this.googleDataReturn(data)
      }
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
      const exist = await this.Connect.FindByKey(CONNECTS.google.key)
      exist.redirectUris = [`${getUrl(req.get('Referrer')).origin}/connect/google-add`]
      const params = {
        code: body.code,
        redirectUri: exist.redirectUris[0]
      }
      const credentials = await googleOAuth2ByCode(params)
      if (!credentials) return next(new HttpException(404, 'ErrorCode'))

      if (exist) {//Update
        const data = await this.Connect.Update({
          _id: exist._id,
          redirectUris: exist.redirectUris,
          credentials: credentials,
          profile: credentials && credentials.id_token ? jwtDecode(credentials.id_token) : null,
        })
        if (data) {
          rs.status = true
          rs.data = this.googleDataReturn(data)
        }
      } else {//Insert
        const params: IConnect = {
          name: CONNECTS.google.name,
          key: CONNECTS.google.key,
          order: body.order || 1,
          clientID: body.clientID || null,
          credentials: credentials || null,
          authUri: null,
          redirectUris: [`${getUrl(req.get('Referrer')).origin}/connect/google-add`],
          profile: credentials && credentials.id_token ? jwtDecode(credentials.id_token) : null,
          config: null,
          flag: 1,
          created: { at: new Date(), by: req.verify._id.toString() || null, ip: getIp(req) }
        }
        const data = await this.Connect.Create(params)
        if (data) {
          rs.status = true
          rs.data = this.googleDataReturn(data)
        }
      }
      res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public googleRemoveAuth = async (req: RequestMiddlewares, res: Response, next: NextFunction) => {
    try {
      const body = req.body
      const rs = { data: null, status: false, message: this.googleRemoveAuth.name }
      const exist = await this.Connect.FindByKey(CONNECTS.google.key)
      if (exist) {//Update
        const data = await this.Connect.Update({ _id: exist._id, credentials: null, profile: null })
        if (data) rs.status = true
      } else {//Insert
        const params: IConnect = {
          name: CONNECTS.google.name,
          key: CONNECTS.google.key,
          order: body.order || 1,
          clientID: body.clientID || null,
          credentials: null,
          authUri: null,
          redirectUris: [`${getUrl(req.get('Referrer')).origin}/connect/google-add`],
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

  public googleSetClientID = async (req: RequestMiddlewares, res: Response, next: NextFunction) => {
    try {
      const body = req.body
      if (!body.clientID) next(new HttpException(404, 'noExist'))
      const rs = { data: null, status: false, message: this.googleSetClientID.name }
      const exist = await this.Connect.FindByKey(CONNECTS.google.key)
      if (exist) {//Update
        const data = await this.Connect.Update({ _id: exist._id, clientID: body.clientID })
        if (data) {
          rs.status = true
          rs.data = this.googleDataReturn(data)
        }
      } else {//Insert
        const params: IConnect = {
          name: CONNECTS.google.name,
          key: CONNECTS.google.key,
          order: body.order || 1,
          clientID: body.clientID,
          credentials: null,
          authUri: null,
          redirectUris: [`${getUrl(req.get('Referrer')).origin}/connect/google-add`],
          profile: null,
          config: null,
          flag: 1,
          created: { at: new Date(), by: req.verify._id.toString() || null, ip: getIp(req) }
        }
        const data = await this.Connect.Create(params)
        if (data) {
          rs.status = true
          rs.data = this.googleDataReturn(data)
          rs.data.clientID = data.clientID
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
      const rs = { data: null, status: false, message: this.googleRemoveClientID.name }
      const exist = await this.Connect.FindByKey(CONNECTS.google.key)
      if (exist) {//Update
        const data = await this.Connect.Update({ clientID: null, credentials: null, profile: null })
        if (data) rs.status = true
        // console.log(data)
      } else {//Insert
        const params: IConnect = {
          name: CONNECTS.google.name,
          key: CONNECTS.google.key,
          order: body.order || 1,
          clientID: null,
          credentials: null,
          authUri: null,
          redirectUris: [`${getUrl(req.get('Referrer')).origin}/connect/google-add`],
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
