import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { MConfig, IConfig } from './model';
import { ConfigService } from './service';
import { HttpException } from '@/exceptions/http.exception';
import { RequestMiddlewares } from '@/interfaces/auth.interface';
import mongoose from 'mongoose';

export class ConfigController {
  public config = Container.get(ConfigService);

  public get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      queries.page = queries.page ? parseInt(queries.page) : 1
      queries.rowsPerPage = queries.rowsPerPage ? parseInt(queries.rowsPerPage) : 10
      const rs = { data: [] as IConfig[], rowsNumber: 0, message: 'find' }
      const conditions = {} as any
      if (queries.filter) {
        conditions.$and = []
        conditions.$and.push({
          $or: [
            { key: new RegExp(queries.filter, 'i') },
            { value: new RegExp(queries.filter, 'i') }
          ]
        })
      }
      conditions.$and.push({ level: queries.level || 1 })
      if (!queries.sortBy) queries.sortBy = 'key'
      rs.rowsNumber = (await MConfig.countDocuments(conditions))
      rs.data = await this.config.FindAll(conditions)
        .skip((parseInt(queries.page) - 1) * parseInt(queries.rowsPerPage))
        .limit(parseInt(queries.rowsPerPage))
        .sort({ [queries.sortBy]: queries.descending === 'true' ? -1 : 1 }) // 1 ASC, -1 DESC
        .exec()
      // return res.status(200).json(rs)
      res.status(200).json(rs);
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { data: [] }
      rs.data = await this.config.FindAll({ level: 1 })
      res.status(200).json(rs);
    } catch (error) {
      next(error);
    }
  };

  public find = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      if (queries._id) {
        if (Array.isArray(queries._id)) {
          const rs = await this.config.FindAll({ _id: { $in: queries._id } }).exec()
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findById' })
        } else {
          const rs = await this.config.FindById(queries._id)
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findById' })
        }
      } else if (queries.key) {
        if (Array.isArray(queries.key)) {
          const rs = await this.config.FindAll({ key: { $in: queries.key } })
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findOneId' })
        } else {
          const rs = await this.config.FindOne({ key: queries.key })
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findOneId' })
        }
      }
    } catch (error) {
      next(error);
    }
  };

  public findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.params.id);
      const rs: IConfig = await this.config.FindById(_id);

      res.status(200).json({ data: rs, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public findExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      const rs = await MConfig.exists({ key: queries.key });
      if (rs) res.status(200).json(true);
      else res.status(200).json(false);
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: RequestMiddlewares, res: Response, next: NextFunction) => {
    try {
      const body: IConfig = req.body;
      const rs: IConfig = await this.config.Create(body);

      res.status(201).json({ data: rs, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: IConfig = req.body;
      const rs: IConfig = await this.config.Update(body);

      res.status(200).json({ data: rs, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public updateFlag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      if (body.data && Array.isArray(body.data)) {
        const rs = { status: false, success: [], error: [] }
        const session = await mongoose.startSession();
        try {
          session.startTransaction();
          for await (let obj of req.body.data) {
            const item = await this.config.UpdateFlag(obj._id, obj.flag, session)
            if (!item) {
              rs.error.push(obj._id)
              next(new HttpException(401, 'update'))
              break
            } else {
              rs.success.push(obj._id)
            }
          }
          await session.commitTransaction(); // commit transaction and session
        } catch (error) {
          await session.abortTransaction();// abort transaction and session
        } finally {
          session.endSession();
        }
      } else {
        const rs: IConfig = await this.config.UpdateFlag(body._id, body.flag);
        res.status(200).json({ data: rs, message: 'updated' });
      }
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.params.id);
      const rs: IConfig = await this.config.Delete(_id);

      res.status(200).json({ data: rs, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
