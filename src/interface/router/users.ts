import Router from '@koa/router'
import { requireSignature } from '../middleware'

import { Context, ParameterizedContext, State } from '../../app'

export class UsersRouter {
  router: Router<State, Context> = new Router<State, Context>()

  constructor() {
    this.build()
  }

  private build() {
    this.router.post('/', requireSignature, this.register.bind(this))
  }

  private async register(ctx: ParameterizedContext) {
    console.log('POST /users', ctx.state.auth)

    ctx.status = 200

    return
  }
}
