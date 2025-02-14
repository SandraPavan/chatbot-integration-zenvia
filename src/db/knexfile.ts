import { knexSnakeCaseMappers } from 'objection'
import * as dotenv from 'dotenv'
import { type Knex } from 'knex'

dotenv.config()

export type DbOptionsType = Knex.Config & { connection: Knex.PgConnectionConfig }

export const baseConfig = {
  client: 'postgresql',
  connection: {
    host: process.env.DEV_DB_URL || '127.0.0.1',
    port: parseInt(process.env.DEV_DB_PORT || '5432'),
    user: process.env.DEV_DB_USERNAME || 'default', // todo resolve the .env not reading
    password: process.env.DEV_DB_PASSWORD || "secret",
    database: process.env.DEV_DB_DATABASE || 'engine',
  },
  searchPath: ['knex', 'public'],
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: `${__dirname}/migrations`,
    stub: 'migration.stub.ts',
  },
  seeds: {
    directory: `${__dirname}/seeds`,
    stub: 'seed.stub.ts',
  },
  // automatically convert camelCase to snake case
  // so table names are in snake case
  // but we can use camelCase fields per default
  ...knexSnakeCaseMappers(),
} as const satisfies DbOptionsType

export const getDbOptionsFromBaseConfig = (baseConfig: DbOptionsType) => {
  return (newConfig?: DbOptionsType): DbOptionsType => {
    return {
      ...baseConfig,
      ...newConfig,
    }
  }
}

export const getDbOptions = getDbOptionsFromBaseConfig(baseConfig)

export default {
  development: getDbOptions(),
  production: getDbOptions({
    ...baseConfig,
    pool: {
      min: 2,
      max: 100,
    },
  }),
}
