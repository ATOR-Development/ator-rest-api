import { Knex } from 'knex'

import { client, SCHEMA_NAME } from '../knexfile'

export async function up(knex: Knex): Promise<void> {
  if (client === 'pg') {
    await knex.schema.createSchema(SCHEMA_NAME)
  }
}

export async function down(knex: Knex): Promise<void> {
  if (client === 'pg') {
    await knex.schema.dropSchemaIfExists(SCHEMA_NAME)
  }
}
