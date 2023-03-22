import { Knex } from 'knex'

import { client, SCHEMA_NAME } from '../../../knexfile'

export default class BaseRepository<EntityT extends {}> {
  protected tableName: string = 'base'

  protected get table() {
    let table = this.db<EntityT>(this.tableName)

    if (client === 'pg') {
      table = table.withSchema(SCHEMA_NAME)
    }

    return table
  }

  constructor(protected db: Knex) {}

  async first(column: string, value: any): Promise<EntityT | null> {
    return await this.table
      .where(column, value)
      .first<EntityT | undefined>() || null
  }
}
