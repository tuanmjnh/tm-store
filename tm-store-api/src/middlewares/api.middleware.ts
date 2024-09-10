import { NextFunction, Response } from 'express'
import { verify, sign } from 'jsonwebtoken'
import { SECRET_KEY } from '@config'
import { HttpException } from '@exceptions/http.exception'
import { DataStoredInToken, RequestMiddlewares } from '@interfaces/auth.interface'
// import { UserModel } from '@modules/users/model'

export const APISign = ({ params, secret, expires }) => {
  // expires in 24 hours
  secret = secret || process.env.SECRET
  return sign(params, secret, { expiresIn: expires || '24h' })
}
export const APIMiddleware = async (req: RequestMiddlewares, res: Response, next: NextFunction) => {
  try {
    const baseUrl = process.env.BASE_URL.trimChars('/') // .replace(/\/$/, '')
    let reqPath = req.path.trimChars('/')
    if ((reqPath === baseUrl && req.method.toUpperCase() === 'GET') || (reqPath === `${baseUrl}/api/auth` && req.method.toUpperCase() === 'POST')) {
      return next()
    } else {
      let token = req.headers['x-access-token'] as any || req.headers.authorization as any // Express headers are auto converted to lowercase
      if (!token) {
        next(new HttpException(401, 'wrongToken'))// return res.status(401).json({ error: 'no_exist_token' })
      } else {
        // Remove Bearer from string
        if (token.startsWith('Bearer ')) token = token.slice(7, token.length)
        req.verify = { ...(await verify(token, SECRET_KEY)) as DataStoredInToken, ...{ token: token, secret: SECRET_KEY } }
        // console.log(req.verify)
        next()
        // const findUser = await UserModel.findById(req.verify._id)
        // if (findUser) {
        //   req.user = findUser

        //   next()
        // } else {
        //   next(new HttpException(404, 'wrongToken'))
        // }
      }
    }
  } catch (e) {
    // console.log(e)
    next(new HttpException(401, 'wrongToken'))
  }
}
