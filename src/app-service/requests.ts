import { Timestamps } from '../infra/db'
import { Request, RequestsRepository } from '../service/repository'
import { RegisterRelayRequest } from './relays'

export default class RequestsAppService {
  constructor(private requestsRepository: RequestsRepository) {}

  async create(
    request: Omit<Request<RegisterRelayRequest>, 'id' | Timestamps>
  ) {
    await this.requestsRepository.insert(request)
  }
}
