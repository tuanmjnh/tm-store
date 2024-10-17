import { NextFunction, Request, Response } from 'express'
// import { createReadStream, unlinkSync } from 'fs'
// import { HttpException } from '@/exceptions/http.exception'
import { RequestMiddlewares } from '@/interfaces/auth.interface'
import { HttpException } from '@/exceptions/http.exception'
// import { authorize, loadClientID, setClientID, removeClientID, revoke } from '../../services/google/auth'
import { OAuth2ClientGetToken } from '../../services/google/auth-db'

export class GoogleAuthController {
  public get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      const tokens = OAuth2ClientGetToken(queries)
      // console.log(queries)
      const rs = { data: [] as any, status: false, message: 'getAuthCode' }
      if (!rs) next(new HttpException(404, 'noExist'))
      // res.render('google-auth', { title: 'Google auth', content: { clientId: rs } })
      // }
      if (rs.data) rs.status = true
      res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public post = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body
      console.log(body)
      const rs = []//await authorize(SCOPES)
      // return res.status(200).json(rs)
      // res.render('google-auth', { title: 'Google auth', content: rs })
      // res.redirect('/')
    } catch (error) {
      next(error)
    }
  }

  public put = async (req: RequestMiddlewares, res: Response, next: NextFunction) => {
    try {
      if (!req.body.clientId) res.render('google-auth', { title: 'Google auth', content: { error: 'clientId null' } })
      if (!Object.keys(req.body.clientId).length) res.render('google-auth', { title: 'Google auth', content: { error: 'clientId null' } })

      // if (process.env.USE_DB == 'true') {
      //   var clientID = JSON.parse(req.body.clientId)
      //   const rs = await OAuthDB.setClientID(clientID)
      //   if (rs) res.redirect(`/google-auth`)//res.render(`google-auth`, { title: 'Google auth', content: { clientId: rs } })
      //   else res.render(`google-auth`, { title: 'Google auth', content: { error: 'error' } })
      // } else {
      const rs = []//await setClientID(req.body.clientId)
      if (rs) res.redirect(`/google-auth`)//res.render('google-auth', { title: 'Google auth', content: { clientId: rs } })
      else res.render('google-auth', { title: 'Google auth', content: { error: 'error' } })
      // }
    } catch (error) {
      next(error)
    }
  }

  public patch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // await removeClientID()
      res.redirect('/google-auth')
    } catch (error) {
      next(error)
    }
  }

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // await revoke()
      res.redirect('/')
    } catch (error) {
      next(error)
    }
  }
}
