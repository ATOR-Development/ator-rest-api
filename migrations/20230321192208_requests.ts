import { Knex } from 'knex'

import {
  client,
  db,
  onUpdateTrigger,
  SCHEMA_NAME,
  sqlite3UUID
} from '../knexfile'

export async function up(knex: Knex): Promise<void> {
  await db(knex).createTable('requests', async table => {
    table.uuid('id')
      .notNullable()
      .primary()
      .defaultTo(
        client === 'pg'
          ? knex.raw('gen_random_uuid()')
          : knex.raw(sqlite3UUID)
      )
    table.string('address', 42)
      .notNullable()
      .references('address')
      .inTable(client === 'pg' ? `${SCHEMA_NAME}.users` : 'users')
    table.jsonb('request').notNullable()
    table.string('signature', 132).unique().notNullable()
    table.timestamps(true, true)
  })

  await db(knex).raw(onUpdateTrigger('requests'))
}

export async function down(knex: Knex): Promise<void> {
  await db(knex).dropTableIfExists('requests')
}
