import { Knex } from 'knex'

import { SCHEMA_NAME } from '../knexfile'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createSchema(SCHEMA_NAME)
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropSchemaIfExists(SCHEMA_NAME)
}

