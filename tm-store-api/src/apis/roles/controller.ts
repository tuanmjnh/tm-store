import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { MRole, IRole } from './model';
import { RoleService } from './service';
import { HttpException } from '@/exceptions/http.exception';
import { RequestMiddlewares } from '@/interfaces/auth.interface';
import mongoose from 'mongoose';
import { getIp } from '@/utils/tm-request';

export class ConfigController {
  public role = Container.get(RoleService);

  public get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      queries.page = queries.page ? parseInt(queries.page) : 1
      queries.rowsPerPage = queries.rowsPerPage ? parseInt(queries.rowsPerPage) : 10
      const rs = { data: [] as IRole[], rowsNumber: 0, message: 'find' }
      const conditions = { $and: [{ flag: queries.flag ? parseInt(queries.flag) : 1 }] } as any
      if (queries.filter) {
        conditions.$and = []
        conditions.$and.push({
          $or: [
            { key: new RegExp(queries.filter, 'i') },
            { name: new RegExp(queries.filter, 'i') }
          ]
        })
      }
      if (!queries.sortBy) queries.sortBy = 'level'
      rs.rowsNumber = (await MRole.countDocuments(conditions))
      rs.data = await this.role.FindAll(conditions)
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
      const queries = req.query as any
      const rs = { data: [] }
      rs.data = await this.role.FindAll({ flag: queries.flag ? parseInt(queries.flag) : 1 })
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
          const rs = await this.role.FindAll({ _id: { $in: queries._id } }).exec()
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findById' })
        } else {
          const rs = await this.role.FindById(queries._id)
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findById' })
        }
      } else if (queries.key) {
        if (Array.isArray(queries.key)) {
          const rs = await this.role.FindAll({ key: { $in: queries.key } })
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findOneId' })
        } else {
          const rs = await this.role.FindOne({ key: queries.key })
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
      const rs: IRole = await this.role.FindById(_id);

      res.status(200).json({ data: rs, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public findExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      const rs = await MRole.exists({ key: queries.key });
      if (rs) res.status(200).json(true);
      else res.status(200).json(false);
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: RequestMiddlewares, res: Response, next: NextFunction) => {
    try {
      const body: IRole = req.body;
      body.created = { at: new Date(), by: req.verify._id.toString() || null, ip: getIp(req) }
      const rs: IRole = await this.role.Create(body);
      res.status(201).json({ data: rs, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: IRole = req.body;
      const rs: IRole = await this.role.Update(body);

      res.status(200).json({ data: rs, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public updateFlag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      if (body && Array.isArray(body)) {
        const rs = { status: false, success: [], error: [] }
        const session = await mongoose.startSession();
        try {
          session.startTransaction();
          for await (let obj of req.body) {
            const item = await this.role.UpdateFlag(new mongoose.Types.ObjectId(obj._id), obj.flag, session)
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
        const rs: IRole = await this.role.UpdateFlag(new mongoose.Types.ObjectId(body._id), body.flag);
        res.status(200).json({ data: rs, message: 'updated' });
      }
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.params.id);
      const rs: IRole = await this.role.Delete(_id);

      res.status(200).json({ data: rs, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
