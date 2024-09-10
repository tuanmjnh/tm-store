import { NextFunction, Request, Response } from 'express'
import { Container } from 'typedi'
import { createReadStream, unlinkSync } from 'fs'
import { FileManagerService } from './service'
import { HttpException } from '@/exceptions/http.exception'
import { RequestMiddlewares } from '@/interfaces/auth.interface'
import GDrive from '@services/google/drive'

export class FileManagerController {
  public fileManager = Container.get(FileManagerService)

  public get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const files = await GDrive.getFiles()
      const rs = { req: [], files: [], folders: [], nextPageToken: null } as any
      const params = {} as any
      if (req.query.page) params.page = req.query.page || 1
      if (req.query.pageSize) params.pageSize = req.query.pageSize || 10
      if (req.query.nextPageToken) params.nextPageToken = req.query.nextPageToken || null
      params.trashed = req.query.trashed !== undefined ? req.query.trashed : false
      params.mimeType = req.headers['mime-type'] && req.headers['mime-type'] !== 'null' ? req.headers['mime-type'] : null
      const uploadPath = req.headers['upload-path'] && req.headers['upload-path'] !== 'null' ? (req.headers['upload-path']).toString().split('/') : null
      let folderId = req.headers['folder-id'] && req.headers['folder-id'] !== 'null' ? req.headers['folder-id'] : null

      const folders = []
      if (uploadPath && uploadPath.length) {
        for await (const e of uploadPath) {
          const folder = await GDrive.getFolder({ name: e, parents: folders.length ? folders[folders.length - 1].id : null, trashed: params.trashed } as any)
          if (folder) folders.push(folder)
        }
      }
      if (folders.length) {
        rs.folders = await GDrive.getFolders({ parents: (folders.length ? folders[folders.length - 1].id : null), folderId: folderId, trashed: params.trashed } as any)
        // console.log(folders)

        // rs.folders = await GDrive.getFolders({ rootFolder: uploadPath, folderId: folderId })
        if (!folderId && rs.folders && rs.folders.length) folderId = rs.folders[0].id
        params.folderId = folderId
        const getFiles = await GDrive.getFiles(params)
        if (getFiles) {
          rs.files = getFiles.files
          rs.nextPageToken = getFiles.nextPageToken
        }
      }
      return res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public getFolders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const files = await GDrive.getFiles()
      // console.log(files)
      const folderPath = req.headers['upload-path'] ? req.headers['upload-path'] : null
      const mimeType = req.headers['mime-type'] && req.headers['mime-type'] !== 'null' ? req.headers['mime-type'] : null
      const rs = await GDrive.getAll({ folder: folderPath, mimeType: mimeType, trashed: req.query.trashed !== undefined ? req.query.trashed : false } as any)
      if (rs) return res.status(200).json(rs)
      else {
        // GDrive.createFolder({ name: folderPath })
        return res.status(200).json([])
      }
    } catch (error) {
      next(error)
    }
  }

  public getFiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { files: [], nextPageToken: null }
      const params = {} as any
      if (req.query.page) params.page = req.query.page || 1
      if (req.query.pageSize) params.pageSize = req.query.pageSize || 10
      if (req.query.nextPageToken) params.nextPageToken = req.query.nextPageToken || null
      const folderId = req.headers['folder-id'] && req.headers['folder-id'] !== 'null' ? req.headers['folder-id'] : null
      params.trashed = req.query.trashed !== undefined ? req.query.trashed : false
      params.mimeType = req.headers['mime-type'] && req.headers['mime-type'] !== 'null' ? req.headers['mime-type'] : null
      params.folderId = folderId
      const getFiles = await GDrive.getFiles(params)
      if (getFiles) {
        rs.files = getFiles.files
        rs.nextPageToken = getFiles.nextPageToken
      }
      if (rs) return res.status(200).json(rs)
      else return res.status(200).json([])
    } catch (error) {
      next(error)
    }
  }

  public getThumbnail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.query.id) return res.status(404).send('invalid')
      const rs = await GDrive.getDriveThumbnail({ fileId: req.query.id })
      if (rs) return res.status(200).json(rs)
      else return res.status(200).json([])
    } catch (error) {
      next(error)
    }
  }

  public upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uploadPath = req.headers['upload-path'] ? (req.headers['upload-path']).toString().split('/') : null
      const folders = []
      if (uploadPath && uploadPath.length) {
        for await (const e of uploadPath) {
          const folder = await GDrive.createFolder({ name: e, parents: folders && folders.length ? folders[folders.length - 1].id : null, isUnique: true } as any)
          if (folder) folders.push(folder)
        }
      }
      await this.fileManager.diskStorage(req, res)
      GDrive.createFile({
        name: req.file.filename,
        mimeType: req.file.mimetype,
        stream: createReadStream(req.file.path),
        parents: folders[folders.length - 1].id//folders.map(x => x.id) //folders[folders.length - 1].id
      } as any).then(x => {
        // console.log(x)
        unlinkSync(req.file.path)
        if (x) return res.status(201).json(x)
        else next(new HttpException(404, 'noExist'))
      }).catch((e) => { throw new Error(e) })
      // return res.status(201).json({ ok: 1 })
    } catch (error) {
      next(error)
    }
  }

  public put = async (req: RequestMiddlewares, res: Response, next: NextFunction) => {
    try {
      const rs = []
      if (rs) return res.status(202).json(rs)
      else next(new HttpException(404, 'noExist'))
    } catch (error) {
      next(error)
    }
  }

  public trash = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { success: [], error: [], ok: 0 }
      // console.log(req.body)
      for await (let id of req.body.data) {
        const result = await GDrive.updateTrash({ fileId: id, trashed: req.body.trashed || false } as any)
        // console.log(result)
        if (!result) rs.error.push(id)
        else {
          rs.ok = 1
          rs.success.push(id)
        }
      }
      return res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { success: [], error: [], ok: 0 }
      // console.log(req.body)
      for await (let id of req.body) {
        const result = await GDrive.deleteFile({ fileId: id } as any)
        // console.log(result)
        if (!result) rs.error.push(id)
        else {
          rs.ok = 1
          rs.success.push(id)
        }
      }
      return res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public emptyTrash = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rs = { ok: 0 }
      const result = await GDrive.emptyTrash()
      // console.log(result)
      if (result) rs.ok = 1
      return res.status(200).json(rs)
    } catch (error) {
      next(error)
    }
  }

  public getTest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const fileId = req.body.data
      // console.log(fileId)
      // const rs = await GDrive.createFolder({ name: 'test-folder', unique: true })
      // const rs = await GDrive.updateTrash({ fileId: '1gOtj1LsKAzHPT2FlNAyq9x95VLiu2Qk4', trashed: true }) //1k4279j5jDZuAkJRLiR6pooWxZKPQ8JEr
      // const rs = await GDrive.emptyTrash({ fileId: '1ZG1ttdilOy-WBAtwmA6FqB8uGagjQRjP', trashed: true })
      // const rs = await GDrive.permissionsCreate({
      //   fileId: '1gOtj1LsKAzHPT2FlNAyq9x95VLiu2Qk4',
      //   role: 'writer',
      //   type: 'user',
      //   emailAddress: 'minhtuan200990tmstore@gmail.com'
      // })
      // const rs = await GDrive.getFolderById({ name: 'test-category', rootFolderId: GDrive.FOLDER_ROOT })
      // const rs = await GDrive.deleteFile({ fileId: '1gOtj1LsKAzHPT2FlNAyq9x95VLiu2Qk4' })//1k4279j5jDZuAkJRLiR6pooWxZKPQ8JEr
      const rs = await GDrive.getAll({} as any)
      // console.log(rs)
      if (rs) return res.status(200).json(rs)
      else next(new HttpException(404, 'noExist'))
    } catch (error) {
      next(error)
    }
  }
}
