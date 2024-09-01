import { Router } from 'express';
import { UserController } from './controller';
// import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { APIMiddleware } from '@middlewares/api.middleware';
// import { ValidationMiddleware } from '@middlewares/validation.middleware';

export class UserRoute implements Routes {
  public path = '/api/users';
  public router = Router();
  public controller = new UserController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(`${this.path}`, APIMiddleware, this.controller.get);
    this.router.get(`${this.path}/:id`, APIMiddleware, this.controller.findById);
    this.router.get(`${this.path}/find`, APIMiddleware, this.controller.find);
    this.router.get(`${this.path}/exist`, APIMiddleware, this.controller.findExist);
    this.router.post(`${this.path}`, APIMiddleware, this.controller.create);
    this.router.post(`${this.path}/import`, APIMiddleware, this.controller.import);
    this.router.put(`${this.path}`, APIMiddleware, this.controller.update);
    this.router.put(`${this.path}/verify`, APIMiddleware, this.controller.verify);
    this.router.put(`${this.path}/reset-password`, APIMiddleware, this.controller.resetPassword);
    this.router.put(`${this.path}/change-password`, APIMiddleware, this.controller.changePassword);
    this.router.patch(`${this.path}`, APIMiddleware, this.controller.updateFlag);
    // this.router.delete(`${this.path}/:id`, APIMiddleware, this.user.delete);
  }
}
