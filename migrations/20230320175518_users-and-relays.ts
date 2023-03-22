import { Knex } from 'knex'

import { client, db, onUpdateTrigger, SCHEMA_NAME } from '../knexfile'

export async function up(knex: Knex): Promise<void> {
  /**
   * Users
   */
  await db(knex).createTable('users', table => {
    table.string('address', 42).primary()
    table.timestamps(true, true)
  })

  await db(knex).raw(
    client === 'pg'
      ? onUpdateTrigger('users')
      : onUpdateTrigger('users', 'address')
  )

  /**
   * Relays
   */
  await db(knex).createTable('relays', table => {
    table.string('fingerprint', 40).primary()
    table.string('owner', 42)
      .notNullable()
      .references('address')
      .inTable( client === 'pg' ? `${SCHEMA_NAME}.users` : `users`)
    table.timestamps(true, true)
  })

  await db(knex).raw(
    client === 'pg'
      ? onUpdateTrigger('relays')
      : onUpdateTrigger('relays', 'fingerprint')
  )
}

export async function down(knex: Knex): Promise<void> {
  await db(knex).dropTableIfExists('relays')
  await db(knex).dropTableIfExists('users')
}
