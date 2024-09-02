import { NextFunction, Request, Response } from 'express'
import { Container } from 'typedi'
import { RequestMiddlewares } from '@/interfaces/auth.interface';
import { MUser } from '@apis/users/model';
import { MRole, IRole } from '@apis/roles/model';
import { constantUsers, constantRoutes } from './constant';
import { AuthService } from './service';
import { HttpException } from '@/exceptions/httpException';
import { SHA256 } from '@/utils/tm-crypto';
import { sign } from 'jsonwebtoken'
import { SECRET_KEY } from '@config'

// export interface IUserAuth extends IUser {
//   routes: Array<string>
// }

export class AuthController {
  public auth = Container.get(AuthService)

  public getAuthRoutes = async (authRoles) => {
    const roles: IRole[] = await MRole.find({ _id: { $in: authRoles } }).sort({ level: 1 })
    const authRoutes: Array<string> = []
    roles.forEach((e: IRole) => {
      authRoutes.pushIfNotExist(e.routes)
    })
    return authRoutes
  }

  public verify = async (req: RequestMiddlewares, res: Response, next: NextFunction) => {
    try {
      let rs = constantUsers.find((x) => x._id === req.verify._id)
      // let routes = []
      // get database account
      if (rs) {
        // routes = await getConstantRoutes()
        rs.routes = constantRoutes
      } else {
        rs = await MUser.findOne({ _id: req.verify._id })
        if (!rs) return next(new HttpException(401, 'wrongToken'))
        else {
          rs.routes = await this.getAuthRoutes(rs.roles)
          // fix date
          rs.dateBirth = moment(rs.dateBirth).format('YYYY-MM-DD')
          return res.status(200).json({ data: rs, message: 'verify' })
        }
      }
    } catch (error) {
      next(error)
    }
  }

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // check req data
      if (!req.body.username || !req.body.password) { return res.status(404).json({ msg: 'no_exist' }) }
      // constant account
      let rs = constantUsers.find((x) => x.username === req.body.username && x.password === SHA256(req.body.password + x.salt))
      let routes = []
      // let routes = []
      if (rs) {
        rs.routes = constantRoutes
      } else {
        // throw new Error('wrong')
        rs = await MUser.findOne({ username: req.body.username })
        // not exist username
        if (!rs) return res.status(502).json({ msg: 'no_exist' })
        // check password
        if (rs.password !== SHA256(req.body.password + rs.salt)) { return res.status(503).json({ msg: 'no_exist' }) }
        // check lock
        if (!rs.enable) return res.status(504).json({ msg: 'locked' })
        // Routes
        // rs.routes = await this.getAuthRoutes(rs.roles)
        routes = await this.getAuthRoutes(rs.roles)
        // rs = { ...rs, ...{ routes: routes } }
        // fix date
        // rs.dateBirth = moment(rs.dateBirth).format('YYYY-MM-DD')
        // Update last login
        await MUser.updateOne({ _id: rs._id }, { $set: { lastLogin: new Date() } })
      }
      // Token
      const token = sign({ _id: rs._id, code: rs.username }, SECRET_KEY, { expiresIn: '24h' })
      if (rs) return res.status(200).json({ token, data: rs, routes: routes, message: 'login' })
      else return next(new HttpException(401, 'wrongToken'))
    } catch (error) {
      next(error)
    }
  }
}
