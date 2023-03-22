import 'mocha'

import AirTorProtocolRestApi from '../../src/app'
export { default as Alice } from '../keys/alice.json'
export { default as Bob } from '../keys/bob.json'

export const api = new AirTorProtocolRestApi()

before(async () => { await api.start() })

after(async () => { await api.stop() })
