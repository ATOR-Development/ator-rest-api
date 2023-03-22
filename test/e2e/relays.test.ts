import chai from 'chai'
import chaiHttp from 'chai-http'
import { Wallet } from 'ethers'

import { api, Alice } from './setup'

chai.use(chaiHttp)
const expect = chai.expect

describe('Relays API', () => {
  it('registers relays', async () => {
    const route = '/relays'

    try {
      const signer = new Wallet(Alice.privateKey)
      const address = signer.address
      const fingerprint = 'AAAABBBBCCCCDDDDEEEEFFFF0000111122223333'
      const message = { method: 'register', address, fingerprint }
      const signature = await signer.signMessage(JSON.stringify(message))

      const res = await chai
        .request(api.server)
        .post(route)
        .query({ address, signature })
        .send(message)

      console.log('res.body', res.body)
      console.log('res.text', res.text)
      expect(res).to.have.status(200)
    } catch (error) {
      console.error(error.message)
      expect.fail(error.message)
    }
  })
})
