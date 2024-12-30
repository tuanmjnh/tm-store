import 'reflect-metadata'
import 'utils/prototypes'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
// import morgan from 'morgan'
// import swaggerJSDoc from 'swagger-jsdoc'
// import swaggerUi from 'swagger-ui-express'
import { PACKAGE, NODE_ENV, PORT, ORIGIN, CREDENTIALS, BASE_URL, UPLOAD_MAX_SIZE } from './config'//LOG_FORMAT
import { dbConnection } from './services/mongoose'
import { Routes } from './interfaces/routes.interface'
// import { ErrorMiddleware } from './middlewares/error.middleware'
// import { APIMiddleware } from './middlewares/api.middleware'
// import { logger, stream } from './utils/logger'
import { InitializeConfig } from './apis/configs/service'

export class App {
  public app: express.Application
  public env: string
  public port: string | number

  constructor(routes: Routes[]) {
    this.app = express()
    this.env = NODE_ENV || 'development'
    this.port = PORT || 3000

    this.connectToDatabase()
    this.initializeHomePageRoute()
    this.initializeMiddlewares()
    this.initializeConfigs()
    this.initializeRoutes(routes)
    this.initializeSwagger()
    // this.initializeErrorHandling()
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Web server listening on: http://127.0.0.1:${this.port}`)
      console.log(`Mode: ${process.env.NODE_ENV}`)
      console.log(`Base URL: ${process.env.BASE_URL}`)
      // logger.info(`=================================`)
      // logger.info(`======= ENV: ${this.env} =======`)
      // logger.info(`🚀 App listening on the port: http://127.0.0.1:${this.port || 8080}`)
      // // logger.info(`🚀 App listening on the port ${this.port}`)
      // logger.info(`=================================`)
    })
  }

  public getServer() {
    return this.app
  }

  private async connectToDatabase() {
    await dbConnection()
  }

  private initializeMiddlewares() {
    // this.app.use(morgan(LOG_FORMAT, { stream }))
    // this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }))
    // CORS middleware
    this.app.use(cors())
    // this.app.options('*', cors())
    this.app.use(hpp())
    this.app.use(helmet())
    this.app.use(compression())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cookieParser())
    // bodyParser
    // app.use(bodyParser.json())
    // app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(bodyParser.json({ limit: '50mb' }))
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    // this.app.use(APIMiddleware)
  }

  private initializeConfigs() {
    // locals configs
    InitializeConfig(this.app).then(x => {
      console.log(`Server configs:`)
      console.log(this.app.locals.configs)
    })
  }

  private initializeHomePageRoute() {
    this.app.get(BASE_URL, function (req, res, next) {
      // const a = io.getDirectories({ root: process.env.ROOT_PATH, dir: '/' })
      let rs = `TM-Store Express Server api\r\n`
      rs = `${rs}version: ${PACKAGE.version}\r\n`
      rs = `${rs}Mode: ${process.env.NODE_ENV}\r\n`
      res.end(rs)
    })
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router)
    })
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'TM-Store api',
        },
      },
      apis: ['swagger.yaml'],
    }

    // const specs = swaggerJSDoc(options)
    // this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
  }

  // private initializeErrorHandling() {
  //   this.app.use(ErrorMiddleware)
  // }
}
