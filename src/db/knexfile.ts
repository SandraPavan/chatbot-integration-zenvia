import { knexSnakeCaseMappers } from 'objection';
import * as dotenv from 'dotenv';
import { type Knex } from 'knex';

dotenv.config();

export type DbOptionsType = Knex.Config & {
  connection: Knex.PgConnectionConfig;
};

export const baseConfig = {
  client: 'postgresql',
  connection: {
    host: 'localhost',
    port: parseInt('5432'),
    user: 'default',
    password: 'secret',
    database: 'postgres',
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
} as const satisfies DbOptionsType;

export const getDbOptionsFromBaseConfig = (baseConfig: DbOptionsType) => {
  return (newConfig?: DbOptionsType): DbOptionsType => {
    return {
      ...baseConfig,
      ...newConfig,
    };
  };
};

export const getDbOptions = getDbOptionsFromBaseConfig(baseConfig);

export default {
  development: getDbOptions(),
  production: getDbOptions({
    ...baseConfig,
    pool: {
      min: 2,
      max: 100,
    },
  }),
};
