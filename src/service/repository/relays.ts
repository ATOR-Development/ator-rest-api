import { Timestamps, WithTimestamps } from '../../infra/db'
import BaseRepository from './base'

export interface Relay extends WithTimestamps {
  fingerprint: string
  owner: string
}

export default class RelaysRepository extends BaseRepository<Relay> {
  protected tableName: string = 'relays'

  async insert(relay: Omit<Relay, Timestamps>): Promise<Relay> {
    const [ saved ] = await this.table.insert(relay, '*')

    return saved
  }
}
