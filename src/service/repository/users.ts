import { Timestamps } from 'infra/db'
import BaseRepository from './base'

export interface User {
  address: string
  created_at: Date
  updated_at: Date
}

export default class UsersRepository extends BaseRepository<User> {
  protected tableName: string = 'users'

  async insert(user: Omit<User, Timestamps>): Promise<User> {
    const [ saved ] = await this.table.insert(user, '*')

    return saved
  }
}
