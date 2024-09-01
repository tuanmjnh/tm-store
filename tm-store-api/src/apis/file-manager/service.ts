import { Service } from 'typedi'
import multer from 'multer'
import { existsSync, mkdirSync } from 'fs'
import { NewGuid } from '@utils/tm-crypto'
import { getExtention } from '@/utils/tm-files'
import { promisify } from 'util'

@Service()
export class FileManagerService {
  public MemoryStorageMulter = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: parseInt(process.env.UPLOAD_MAX_SIZE) },
  }).single('file')

  public DiskStorageMulter = multer({
    storage: multer.diskStorage({
      destination: async function (req, file, callback) {
        req.app.locals.configs.upload_path = req.app.locals.configs.upload_path || 'uploads'
        if (!existsSync(req.app.locals.configs.upload_path)) await mkdirSync(req.app.locals.configs.upload_path)
        callback(null, req.app.locals.configs.upload_path)
      },
      filename: function (req, file, callback) {
        if (req.app.locals.configs.upload_rename === 'true') {
          const ext = getExtention(file.originalname)
          callback(null, NewGuid() + ext)
        } else callback(null, file.originalname)
      }
    }),
    limits: { fileSize: parseInt(process.env.UPLOAD_MAX_SIZE) },
  }).single('file')

  public memoryStorage = promisify(this.MemoryStorageMulter)
  public diskStorage = promisify(this.DiskStorageMulter)
}
