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
  let verifiedAddress
  if (signature && address) {
    try {
      verifiedAddress = verifyMessage(JSON.stringify(message), signature)
      signatureIsValid = verifiedAddress === address
        && /0x[a-f0-9]{130}/.test(signature)
    } catch (error) {}
  }

  if (signature && signatureIsValid && verifiedAddress) {
    ctx.state.auth = {
      address: verifiedAddress,
      signature: signature.toLowerCase()
    }
    
    await next()
  } else {
    ctx.status = 401

    return
  }
}
