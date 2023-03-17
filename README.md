# AirTor Protocol REST API

This repository contains the REST API component of the AirTor Protocol stack.
Built with KoaJS and TypeScript.

## Setup
### Install
```bash
$ npm i
```

### Database Migrations
Ensure you have a `postgres` database running locally, configured via environment variables found in `knexfile.ts`.  You can use a connection string with the environment variable `DB_CONNECTION`, which will override the others.

You will need to create a new database called `airtor`:

```sql
CREATE DATABASE airtor
```

Then, run the migrations with the following command:

```bash
$ npx knex migrate:latest
```

If you run into any trouble, refer to the [KnexJS Migration CLI Guide](https://knexjs.org/guide/migrations.html#migration-cli).

## Development

This will watch for code changes and rebuild/reload

```bash
$ npm run dev
```

## Build

Build artifacts are placed in the `dist` folder in the root of the repository

```bash
$ npm run build
```

## Run

```bash
$ npm start
```
