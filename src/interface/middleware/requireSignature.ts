import { verifyMessage } from 'ethers'

import { ParameterizedContext } from '../../app'

export default async (
  ctx: ParameterizedContext,
  next: () => Promise<any>
) => {
  const signature = Array.isArray(ctx.query.signature)
    ? ctx.query.signature[0]
    : ctx.query.signature
  const address = Array.isArray(ctx.query.address)
    ? ctx.query.address[0]
    : ctx.query.address
  const message = ctx.request.body as any

  let signatureIsValid = false
  if (signature && address) {
    try {
      const verifiedAddress = verifyMessage(JSON.stringify(message), signature)
      signatureIsValid = verifiedAddress.toUpperCase() === address.toUpperCase()
    } catch (error) {}
  }

  if (signatureIsValid && address) {
    ctx.state.auth = { address }
    
    await next()
  } else {
    ctx.status = 401

    return
  }
}
