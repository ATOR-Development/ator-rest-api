import Router from '@koa/router'
import { requireSignature } from '../middleware/index'

import { AuthorizedContext, Context, State } from '../../app'

export class RelaysRouter {
  router: Router<State, Context> = new Router<State, Context>()

  constructor() {
    this.build()
  }

  private build() {
    this.router.post('/', requireSignature, this.register.bind(this))
  }

  private async register(ctx: AuthorizedContext) {
    console.log('POST /relays', ctx.state.auth, ctx.request.body)
    
    const { address } = ctx.state.auth

    // TODO -> Validate request

    // TODO -> relay application service -> register relay

    ctx.status = 200

    return
  }
}
