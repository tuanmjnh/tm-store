import { Router } from 'express';
import { GoogleAuthController } from './controller';
import { Routes } from '@interfaces/routes.interface';
import { APIMiddleware } from '@middlewares/api.middleware';

export class GoogleAuthRoute implements Routes {
  public path = '/api/google-auth';
  public router = Router();
  public controller = new GoogleAuthController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(`${this.path}`, APIMiddleware, this.controller.get);
    this.router.post(`${this.path}`, APIMiddleware, this.controller.post);
    this.router.put(`${this.path}`, APIMiddleware, this.controller.put);
    this.router.patch(`${this.path}`, APIMiddleware, this.controller.patch);
    this.router.delete(`${this.path}`, APIMiddleware, this.controller.delete);
  }
}
