import { Knex } from 'knex'

const schema = 'airtor' // TODO -> from config

export default class BaseRepository<EntityT extends {}> {
  protected tableName: string = 'base'

  protected get table() {
    return this.db<EntityT>(this.tableName).withSchema(schema)
  }

  constructor(protected db: Knex) {}

  async first(column: string, value: any): Promise<EntityT | null> {
    return await this.table
      .where(column, value)
      .first<EntityT | undefined>() || null
  }
}
