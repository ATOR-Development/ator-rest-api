import { Timestamps, WithTimestamps } from '../../infra/db'
import BaseRepository from './base'

export interface Request<T = any> extends WithTimestamps {
  id: string
  address: string
  request: T
  signature: string
}

export default class RequestsRepository extends BaseRepository<Request> {
  protected tableName: string = 'requests'

  async insert(request: Omit<Request, 'id' | Timestamps>): Promise<Request> {
    const [ saved ] = await this.table.insert(request, '*')

    return saved
  }
}
