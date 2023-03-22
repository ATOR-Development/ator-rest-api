import { Knex } from 'knex'

import { client, SCHEMA_NAME } from '../knexfile'

export async function up(knex: Knex): Promise<void> {
  if (client === 'pg') {
    await knex.raw(`
      CREATE OR REPLACE FUNCTION ${SCHEMA_NAME}.on_update_timestamp()
      RETURNS TRIGGER AS
      $FUNC$
        BEGIN
          NEW."updated_at" = now();
          RETURN NEW;
        END;
      $FUNC$
      LANGUAGE plpgsql;
    `)
  }
}

export async function down(knex: Knex): Promise<void> {
  if (client === 'pg') {
    await knex.raw(`DROP FUNCTION IF EXISTS ${SCHEMA_NAME}.on_update_timestamp`)
  }
}
