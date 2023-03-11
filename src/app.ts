import 'dotenv/config'
import Koa from 'koa'
import Router from '@koa/router'
import { Server } from 'http'

export default class AirTorProtocolRestApi {
  private port: number = 1987
  server!: Server
  app: Koa = new Koa()

  constructor() {
    this.build()
  }

  private build() {
    const router = new Router()

    router.get('/healthcheck', async (ctx) => {
      ctx.status = 200
      ctx.body = 'OK'

      return
    })

    this.app
      .use(async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*')

        await next()
      })
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
    }
  }
}
