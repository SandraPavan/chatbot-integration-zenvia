import knex, { Knex } from 'knex'
import knexfile from './knexfile'
import { Model } from 'objection'

const ENV = ['local', 'development', 'staging', 'qa', 'production'] as const

const ENV_KNEX_MAPPING = {
  production: () => knex(knexfile.production),
  development: () => knex(knexfile.development),
} as const

type VALID_ENV = (typeof ENV)[number]

function checkEnvIsValid(value: unknown): asserts value is VALID_ENV {
  if (!(typeof value === 'string' && ENV.find((env) => env === value))) {
    throw new Error(`DB Setup: Unsupported ENV value: ${value}`)
  }
}

function getKnexConfigsForEnv(env: VALID_ENV) {
  switch (env) {
    case 'local':
    case 'development':
    case 'staging':
    case 'qa':
      return ENV_KNEX_MAPPING.development()
    case 'production':
      return ENV_KNEX_MAPPING.production()
    default:
      // exhaustive check in compile time
      const invalidENV: never = env
      return invalidENV
  }
}

export default async function setupDB(): Promise<Knex> {
  const ENV = process.env.ENV || 'development'
  checkEnvIsValid(ENV)

  const db = getKnexConfigsForEnv(ENV)

  Model.knex(db)
  return db
}
