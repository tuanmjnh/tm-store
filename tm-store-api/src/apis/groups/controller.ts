import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { MGroup, IGroup } from './model';
import { GroupService } from './service';
import { HttpException } from '@/exceptions/http.exception';
import { RequestMiddlewares } from '@/interfaces/auth.interface';
import mongoose from 'mongoose';
import { getIp } from '@/utils/tm-request';
import { getPagination } from '@utils/tm-pagination';

export class GroupController {
  public group = Container.get(GroupService);

  public get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      queries.page = queries.page ? parseInt(queries.page) : 1
      queries.rowsPerPage = queries.rowsPerPage ? parseInt(queries.rowsPerPage) : 10
      const rs = { data: [] as IGroup[], rowsNumber: 0, message: 'find' }

      const conditions = { $and: [] }
      if (queries.flag) conditions.$and.push({ flag: parseInt(queries.flag) })
      if (queries.type) conditions.$and.push({ type: queries.type })
      else conditions.$and.push({ type: 'product' })

      if (queries.filter) {
        conditions.$and = []
        conditions.$and.push({
          $or: [
            { title: new RegExp(queries.filter, 'i') }
          ]
        })
      }
      if (!queries.sortBy) queries.sortBy = 'order'
      rs.rowsNumber = (await MGroup.countDocuments(conditions))
      rs.data = await this.group.FindAll(conditions)
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
      rs.data = await this.group.FindAll({ flag: queries.flag ? parseInt(queries.flag) : 1 })
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
          const rs = await this.group.FindAll({ _id: { $in: queries._id } }).exec()
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findById' })
        } else {
          const rs = await this.group.FindById(queries._id)
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findById' })
        }
      } else if (queries.code) {
        if (Array.isArray(queries.code)) {
          const rs = await this.group.FindAll({ code: { $in: queries.code } })
          if (!rs) next(new HttpException(404, 'noExist'))
          return res.status(200).json({ data: rs, message: 'findOneId' })
        } else {
          const rs = await this.group.FindOne({ code: queries.code })
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
      const rs: IGroup = await this.group.FindById(_id);

      res.status(200).json({ data: rs, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public findExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      const rs = await MGroup.exists({ code: queries.code.toUpperCase() });
      if (rs) res.status(200).json(true);
      else res.status(200).json(false);
    } catch (error) {
      next(error);
    }
  };

  public getMeta = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = req.query as any
      const conditions = queries.key ? { 'meta.key': new RegExp(queries.filter, 'i') } : { 'meta.value': new RegExp(queries.filter, 'i') }
      const rs = { rowsNumber: 0, data: [] }
      rs.data = await MGroup.distinct(queries.key ? 'meta.key' : 'meta.value', conditions)
      rs.rowsNumber = rs.data.length

      if (queries.page && queries.rowsPerPage) res.status(200).json(getPagination(rs, parseInt(queries.page), parseInt(queries.rowsPerPage)));
      else res.status(200).json(rs);
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: RequestMiddlewares, res: Response, next: NextFunction) => {
    try {
      const body: IGroup = req.body;
      body.created = { at: new Date(), by: req.verify._id.toString() || null, ip: getIp(req) }
      const rs: IGroup = await this.group.Create(body);
      res.status(201).json({ data: rs, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: IGroup = req.body;
      const rs: IGroup = await this.group.Update(body);

      res.status(200).json({ data: rs, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: IGroup = req.body;
      const data = {
        _id: body._id,
        parent: body.parent,
        level: body.level,
        order: body.order
      }
      const rs: IGroup = await this.group.UpdateOrder(data);

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
          for await (let obj of req.body.data) {
            const item = await this.group.UpdateFlag(new mongoose.Types.ObjectId(obj._id), obj.flag, session)
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
        const rs: IGroup = await this.group.UpdateFlag(new mongoose.Types.ObjectId(body._id), body.flag);
        res.status(200).json({ data: rs, message: 'updated' });
      }
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.params.id);
      const rs: IGroup = await this.group.Delete(_id);

      res.status(200).json({ data: rs, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
