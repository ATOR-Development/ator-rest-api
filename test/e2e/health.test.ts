import chai from 'chai'
import chaiHttp from 'chai-http'

import { api } from './setup'

chai.use(chaiHttp)
const expect = chai.expect

describe('Health API', () => {
  it('responds to basic healthcheck', async () => {
    const route = '/healthcheck'

    try {
      const res = await chai.request(api.server).get(route)

      expect(res).to.have.status(200)
      expect(res.text).to.equal('OK')
    } catch (error) {
      expect.fail(error)
    }
  })
})
