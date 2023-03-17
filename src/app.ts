import 'dotenv/config'
import Koa from 'koa'
import Router from '@koa/router'
import { Server } from 'http'
import bodyParser from 'koa-bodyparser'

import { UsersRouter } from './interface/router'

export interface AuthState {
  address: string
}
export type State = Koa.DefaultState & {
  auth?: AuthState
}
export type Context = Koa.DefaultContext & {}
export type ParameterizedContext = Koa.ParameterizedContext<
  State,
  Context & Router.RouterParamContext<State, Context>,
  unknown
>

export default class AirTorProtocolRestApi {
  private port: number = 1987
  server!: Server
  app: Koa = new Koa()

  constructor() {
    this.build()
  }

  private build() {
    const router = new Router()

    const usersRouter = new UsersRouter()
    
    router.use(
      '/users',
      usersRouter.router.routes(),
      usersRouter.router.allowedMethods()
    )

    router.get('/healthcheck', async (ctx) => {
      ctx.status = 200
      ctx.body = 'OK'

      return
    })

    this.app
      .use(async (ctx, next) => {
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
