import { Router } from 'express';
import { ConnectController } from './controller';
import { Routes } from '@interfaces/routes.interface';
import { APIMiddleware } from '@middlewares/api.middleware';

export class ConnectRoute implements Routes {
  public path = '/api/connects';
  public router = Router();
  public controller = new ConnectController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(`${this.path}`, APIMiddleware, this.controller.get);
    this.router.get(`${this.path}/:id`, APIMiddleware, this.controller.findById);
    this.router.get(`${this.path}/all`, APIMiddleware, this.controller.getAll);
    this.router.get(`${this.path}/find`, APIMiddleware, this.controller.find);
    this.router.get(`${this.path}/exist`, APIMiddleware, this.controller.findExist);
    this.router.post(`${this.path}`, APIMiddleware, this.controller.create);
    this.router.put(`${this.path}`, APIMiddleware, this.controller.update);
    this.router.patch(`${this.path}`, APIMiddleware, this.controller.updateFlag);
    // this.router.delete(`${this.path}/:id`, APIMiddleware, this.user.delete);
  }
}
