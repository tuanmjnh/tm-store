import { Router } from 'express'
import { FileManagerController } from './controller'
import { Routes } from '../../interfaces/routes.interface'
import { APIMiddleware } from '../../middlewares/api.middleware'

export class FileManagerRoute implements Routes {
  public path = '/api/file-manager'
  public router = Router()
  public controller = new FileManagerController()

  constructor() {
    this.initializeRoutes()
  }
  private initializeRoutes() {
    this.router.get(`${this.path}`, APIMiddleware, this.controller.get)
    this.router.get(`${this.path}/folders`, APIMiddleware, this.controller.getFolders)
    this.router.get(`${this.path}/files`, APIMiddleware, this.controller.getFiles)
    this.router.get(`${this.path}/thumbnail`, APIMiddleware, this.controller.getThumbnail)
    this.router.post(`${this.path}`, APIMiddleware, this.controller.upload)
    this.router.put(`${this.path}`, APIMiddleware, this.controller.put)
    this.router.patch(`${this.path}`, APIMiddleware, this.controller.trash)
    this.router.patch(`${this.path}/empty`, APIMiddleware, this.controller.emptyTrash)
    this.router.delete(`${this.path}`, APIMiddleware, this.controller.delete)
  }
}
