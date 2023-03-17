import 'dotenv/config'
import type { Knex } from 'knex'

type ConnectionConfig = {
  host: string
  port: number
  user: string
  password: string
  database: string
}

export const SCHEMA_NAME = process.env.DB_SCHEMA || 'airtor'
let connection: string | undefined | ConnectionConfig

const host = process.env.DB_HOST || 'localhost'
const port = Number.parseInt(process.env.DB_PORT || '') || 5432
const user = process.env.DB_USER || 'postgres'
const password = process.env.DB_PASS || 'postgrespw'
export const DATABASE_NAME = process.env.DB_NAME || 'airtor'
const database = DATABASE_NAME

connection = process.env.DB_CONNECTION

if (!connection) {
  connection = { host, port, user, password, database }
}

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
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

export default config
