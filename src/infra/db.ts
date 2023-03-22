import knex from 'knex'

export type WithTimestamps = {
  created_at: Date
  updated_at: Date
}
export type Timestamps = keyof WithTimestamps

export default (
  client: string,
  connection: string
) => knex({ client, connection })
