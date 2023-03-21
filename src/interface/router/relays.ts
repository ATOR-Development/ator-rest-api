import Router from '@koa/router'
import { requireSignature } from '../middleware/index'

import { AuthorizedContext, Context, State } from '../../app'
import {
  RegisterRelayRequest,
  RelaysAppService,
  RelaysRequestInvalidError
} from '../../app-service'

export default class RelaysRouter {
  router: Router<State, Context> = new Router<State, Context>()

  constructor(private relaysAppService: RelaysAppService) {
    this.build()
  }

  private build() {
    this.router.post('/', requireSignature, this.register.bind(this))
  }

  private async register(
    ctx: AuthorizedContext<Partial<RegisterRelayRequest>>
  ) {
    const { address, signature } = ctx.state.auth

    try {
      const relay = await this.relaysAppService.register(
        address,
        signature,
        ctx.request.body
      )
      ctx.status = 200
      ctx.body = relay

      return
    } catch (error) {
      if (error instanceof RelaysRequestInvalidError) {
        ctx.status = error.status
        ctx.body = error.message

        return
      }

      console.error(error)
      ctx.status = 500
      
      return
    }
  }
}
