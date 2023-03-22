import Alice from '../../keys/alice.json'
import {
  RegisterRelayRequest,
  RelaysAppService,
  RelaysRequestInvalidError
} from '../../../src/app-service'
import { expect } from 'chai'

const fingerprint = 'AAAABBBBCCCCDDDDEEEEFFFF0000111122223333'

describe('RelaysAppService', () => {
  it('throws on empty requests', () => {
    expect(() => {
      RelaysAppService.relayRequestIsValid(Alice.address, {})
    }).to.throw(RelaysRequestInvalidError)
  })

  it('throws on requests without a method', () => {
    const request: any = { address: Alice.address, fingerprint }

    expect(() => {
      RelaysAppService.relayRequestIsValid(Alice.address, request)
    }).to.throw(RelaysRequestInvalidError)
  })

  it('throws on requests with incorrect method', () => {
    const request: any = {
      method: 'register2',
      address: Alice.address,
      fingerprint
    }

    expect(() => {
      RelaysAppService.relayRequestIsValid(Alice.address, request)
    }).to.throw(RelaysRequestInvalidError)
  })

  it('throws on requests without an address', () => {
    const request: any = { method: 'register', fingerprint }

    expect(() => {
      RelaysAppService.relayRequestIsValid(Alice.address, request)
    }).to.throw(RelaysRequestInvalidError)
  })

  it('validates relay registration requests', () => {
    const request: any = {
      method: 'register',
      address: Alice.address,
      fingerprint
    }

    const requestIsValid = RelaysAppService.relayRequestIsValid(
      Alice.address,
      request
    )

    expect(requestIsValid).to.be.true
  })

  it('throws on relay registration requests without a fingerprint', () => {
    const request: any = { method: 'register', address: Alice.address }

    expect(() => {
      RelaysAppService.relayRequestIsValid(Alice.address, request)
    }).to.throw(RelaysRequestInvalidError)
  })
})
