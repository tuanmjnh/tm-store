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
    // this.router.get(`${this.path}/:id`, APIMiddleware, this.controller.findById);
    this.router.get(`${this.path}/find`, APIMiddleware, this.controller.find);
    this.router.get(`${this.path}/exist`, APIMiddleware, this.controller.findExist);
    this.router.patch(`${this.path}`, APIMiddleware, this.controller.updateFlag);
    // this.router.delete(`${this.path}/:id`, APIMiddleware, this.user.delete);
    //Google
    this.router.get(`${this.path}/google/verify`, APIMiddleware, this.controller.googleVerifyToken);
    this.router.get(`${this.path}/google`, APIMiddleware, this.controller.googleGetAuth);
    this.router.post(`${this.path}/google`, APIMiddleware, this.controller.googleAuthByCode);
    this.router.put(`${this.path}/google`, APIMiddleware, this.controller.googleSetClientID);
    this.router.patch(`${this.path}/google`, APIMiddleware, this.controller.googleRemoveAuth);
    this.router.delete(`${this.path}/google`, APIMiddleware, this.controller.googleRemoveClientID);
  }
}
