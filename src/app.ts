import 'dotenv/config'
import Koa, { Request } from 'koa'
import Router from '@koa/router'
import { Server } from 'http'
import bodyParser from 'koa-bodyparser'

import { RelaysRouter } from './interface/router'
import { RelaysAppService, RequestsAppService, UsersAppService } from './app-service'
import { RelaysRepository, RequestsRepository, UsersRepository } from './service/repository'
import { getDb } from './infra'

export interface AuthState {
  address: string
  signature: string
}
export type State = Koa.DefaultState & {
  auth?: AuthState
}
export type Context = Koa.DefaultContext & {
  request: { body: any }
}
export interface AuthorizedState extends State {
  auth: AuthState
  signature: string
}
export type ParameterizedContext = Koa.ParameterizedContext<
  State,
  Context & Router.RouterParamContext<State, Context>,
  unknown
>
export interface AuthorizedContext<RequestBody = unknown>
  extends ParameterizedContext
{
  request: Request & { body: RequestBody }
  state: AuthorizedState
}

export default class AirTorProtocolRestApi {
  private port: number = 1987
  server!: Server
  app: Koa = new Koa()

  constructor() {
    this.build()
  }

  private build() {
    const router = new Router<State, Context>()
    const db = getDb(process.env.DB_CONNECTION || 'No DB_CONNECTION set!')
    const usersRepository = new UsersRepository(db)
    const usersAppService = new UsersAppService(usersRepository)
    const requestsRepository = new RequestsRepository(db)
    const requestsAppService = new RequestsAppService(requestsRepository)
    const relaysRepository = new RelaysRepository(db)
    const relaysAppService = new RelaysAppService(
      usersAppService,
      requestsAppService,
      relaysRepository
    )
    const relaysRouter = new RelaysRouter(relaysAppService)
    
    router.use(
      '/relays',
      relaysRouter.router.routes(),
      relaysRouter.router.allowedMethods()
    )

    router.get('/healthcheck', async (ctx) => {
      ctx.status = 200
      ctx.body = 'OK'

      return
    })

    this.app
      .use(async (ctx, next) => {
         // TODO -> restrict origin
        ctx.set('Access-Control-Allow-Origin', '*')
        ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ctx.set('Access-Control-Allow-Methods', '*')

        await next()
      })
      .use(bodyParser())
      .use(router.routes())
      .use(router.allowedMethods())
  }

  async start() {
    if (!this.server) {
      this.server = this.app.listen(this.port, () => {
        console.log(`AirTor Protocol REST API listening on ${this.port}`)
      })
    }
  }

  async stop() {
    if (this.server) {
      this.server.close(() => console.log('AirTor Protocol REST API stopped'))
      process.exit()
    }
  }
}
