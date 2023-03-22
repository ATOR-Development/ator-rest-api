import { Relay, RelaysRepository } from '../service/repository'
import { RequestsAppService, UsersAppService } from './'

export type RegisterRelayRequest = {
  protocol: 'airtor'
  method: 'register'
  address: string
  fingerprint: string
}

export class RelaysRequestInvalidError extends Error {
  name = 'RelaysRequestInvalidError'

  constructor(
    public message: string = 'Invalid request',
    public status: number = 400
  ) {
    super(message)
  }
}

const relayRequestIsValid = (
  authAddress: string,
  request: Partial<RegisterRelayRequest>
): request is RegisterRelayRequest => {
  const { method, address, fingerprint } = request

  if (!method || method != 'register') {
    throw new RelaysRequestInvalidError('Request must include method: register')
  }

  if (!address || authAddress !== address) {
    throw new RelaysRequestInvalidError('Request must include matching address')
  }

  if (!fingerprint || !/[A-F0-9]{40}/.test(fingerprint)) {
    throw new RelaysRequestInvalidError(
      'Request must include valid fingerprint'
    )
  }

  return true
}

export default class RelaysAppService {
  constructor(
    private usersAppService: UsersAppService,
    private requestsAppService: RequestsAppService,
    private relaysRepository: RelaysRepository
  ) {}

  async register(
    authAddress: string,
    signature: string,
    registerRelayRequest: Partial<RegisterRelayRequest>
  ): Promise<Relay> {
    if (
      RelaysAppService.relayRequestIsValid(
        authAddress,
        registerRelayRequest
      )
    ) {
      const { address, fingerprint } = registerRelayRequest

      await this.usersAppService.getOrCreate({ address })
  
      try {
        await this.requestsAppService.create({
          address,
          request: registerRelayRequest,
          signature
        })
      } catch (error) {
        throw new RelaysRequestInvalidError('Duplicate request', 409)
      }
  
      const relay = await this.relaysRepository.insert({
        fingerprint,
        owner: address
      })
  
      console.log('registered relay', relay)

      return relay
    }

    throw new RelaysRequestInvalidError()
  }

  static relayRequestIsValid = (
    authAddress: string,
    request: Partial<RegisterRelayRequest>
  ): request is RegisterRelayRequest => {
    const { method, address, fingerprint } = request
  
    if (!method || method != 'register') {
      throw new RelaysRequestInvalidError('Request must include method: register')
    }
  
    if (!address || authAddress !== address) {
      throw new RelaysRequestInvalidError('Request must include matching address')
    }
  
    if (!fingerprint || !/[A-F0-9]{40}/.test(fingerprint)) {
      throw new RelaysRequestInvalidError(
        'Request must include valid fingerprint'
      )
    }
  
    return true
  }
}
