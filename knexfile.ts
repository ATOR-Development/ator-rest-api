import 'dotenv/config'
import type { Knex } from 'knex'

type ConnectionConfig = {
  host: string
  port: number
  user: string
  password: string
  database: string
} | {
  filename: string
}

export const SCHEMA_NAME = process.env.DB_SCHEMA || 'airtor'
let connection: string | undefined | ConnectionConfig

const host = process.env.DB_HOST || 'localhost'
const port = Number.parseInt(process.env.DB_PORT || '') || 5432
const user = process.env.DB_USER || 'postgres'
const password = process.env.DB_PASS || 'postgrespw'
export const DATABASE_NAME = process.env.DB_NAME || 'airtor'
const database = DATABASE_NAME
export const client = process.env.DB_CLIENT || 'pg'

connection = process.env.DB_CONNECTION

if (client === 'sqlite3') {
  connection = { filename: connection || ':memory:' }
}

if (!connection) {
  connection = { host, port, user, password, database }
}

export { connection }

export function db(knex: Knex) {
  let db = knex.schema

  if (client === 'pg') {
    db = db.withSchema(SCHEMA_NAME)
  }

  return db
}

export const sqlite3UUID = `
  (lower
    (hex (randomblob(4)))
    || '-' || lower(hex(randomblob(2)))
    || '-4' || substr(lower(hex(randomblob(2))),2)
    || '-' || substr('89ab',abs(random()) % 4 + 1, 1)
    || substr(lower(hex(randomblob(2))),2)
    || '-' || lower(hex(randomblob(6)))
  )
`

const config: { [key: string]: Knex.Config } = {
  development: {
    client,
    connection
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }
}

export const onUpdateTrigger = (tableName: string, pkColumn?: string) => {
  if (client === 'pg') {
    return `
      CREATE TRIGGER ${tableName}_updated_at
      BEFORE UPDATE ON ${SCHEMA_NAME}.${tableName}
      FOR EACH ROW EXECUTE PROCEDURE ${SCHEMA_NAME}.on_update_timestamp();
    `
  } else if (client === 'sqlite3') {
    return `
      CREATE TRIGGER ${tableName}_updated_at
      AFTER UPDATE ON ${tableName}
      BEGIN
        UPDATE ${tableName}
        SET updated_at = now()
        WHERE ${pkColumn} = NEW.${pkColumn};
      END;
    `
  }

  return ''
}

export default config
