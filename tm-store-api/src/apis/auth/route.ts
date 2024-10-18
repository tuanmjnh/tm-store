import { Router } from 'express'
import { AuthController } from './controller'
// import { CreateUserDto } from '@dtos/users.dto'
import { Routes } from '@interfaces/routes.interface'
import { APIMiddleware } from '@middlewares/api.middleware'
// import { ValidationMiddleware } from '@middlewares/validation.middleware'

export class AuthRoute implements Routes {
  public path = '/api/auth'
  public router = Router()
  public auth = new AuthController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, APIMiddleware, this.auth.verify)
    this.router.post(`${this.path}`, this.auth.logIn)
  }
}
