import { Knex } from 'knex'

import { onUpdateTrigger, SCHEMA_NAME } from '../knexfile'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema(SCHEMA_NAME).createTable('requests', table => {
    table.uuid('id')
      .unique()
      .notNullable()
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'))
    table.string('address', 42)
      .notNullable()
      .references('address')
      .inTable(`${SCHEMA_NAME}.users`)
    table.jsonb('request').notNullable()
    table.string('signature', 132).unique().notNullable()
    table.timestamps(true, true)
  })

  await knex.schema.withSchema(SCHEMA_NAME).raw(onUpdateTrigger('requests'))
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema(SCHEMA_NAME).dropTableIfExists('requests')
}
