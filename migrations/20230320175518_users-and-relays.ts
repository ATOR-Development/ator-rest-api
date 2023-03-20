import { Knex } from 'knex'

import { onUpdateTrigger, SCHEMA_NAME } from '../knexfile'

export async function up(knex: Knex): Promise<void> {
  /**
   * Users
   */
  await knex.schema.withSchema(SCHEMA_NAME).createTable('users', table => {
    table.string('address', 42).primary()
    table.timestamps(true, true)
  })

  await knex.schema.withSchema(SCHEMA_NAME).raw(onUpdateTrigger('users'))

  /**
   * Relays
   */
  await knex.schema.withSchema(SCHEMA_NAME).createTable('relays', table => {
    table.string('fingerprint', 40).primary()
    table.string('owner', 42)
      .notNullable()
      .references('address')
      .inTable(`${SCHEMA_NAME}.users`)
    table.timestamps(true, true)
  })

  await knex.schema.withSchema(SCHEMA_NAME).raw(onUpdateTrigger('relays'))
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema(SCHEMA_NAME).dropTableIfExists('relays')
  await knex.schema.withSchema(SCHEMA_NAME).dropTableIfExists('users')
}
