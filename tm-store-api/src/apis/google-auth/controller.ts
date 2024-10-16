import { NextFunction, Request, Response } from 'express'
// import { createReadStream, unlinkSync } from 'fs'
// import { HttpException } from '@/exceptions/http.exception'
import { RequestMiddlewares } from '@/interfaces/auth.interface'
import { authorize, loadClientID, setClientID, removeClientID, revoke } from '../../services/google/auth'
import { SCOPES } from '@services/google/drive'

export class FileManagerController {
  public get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // if (process.env.USE_DB == 'true') {
      //   const rs = await OAuthDB.loadAccLink()
      //   if (rs && rs.clientID)
      //     res.render('google-auth', { title: 'Google auth', content: { clientId: rs.clientID } })
      //   else
      //     res.render('google-auth', { title: 'Google auth', content: {} })
      // } else {
      const rs = await loadClientID()
      res.render('google-auth', { title: 'Google auth', content: { clientId: rs } })
      // }
      return res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public post = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = await authorize(SCOPES)
      // return res.status(200).json(rs)
      // res.render('google-auth', { title: 'Google auth', content: rs })
      res.redirect('/')
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
      const rs = await setClientID(req.body.clientId)
      if (rs) res.redirect(`/google-auth`)//res.render('google-auth', { title: 'Google auth', content: { clientId: rs } })
      else res.render('google-auth', { title: 'Google auth', content: { error: 'error' } })
      // }
    } catch (error) {
      next(error)
    }
  }

  public patch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await removeClientID()
      res.redirect('/google-auth')
    } catch (error) {
      next(error)
    }
  }

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await revoke()
      res.redirect('/')
    } catch (error) {
      next(error)
    }
  }
}
