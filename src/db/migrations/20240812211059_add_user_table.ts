import { Knex } from 'knex'

// Name of the table to be added
const tableName = 'user'

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

  return knex.schema.createTable(tableName, (t) => {
    // uuid for all database row primary identifiers - do not alter
    t.uuid('id').unique().notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'))

    // add additional columns here
    // e.g. t.string('name').notNullable()

    t.enum('type', ['Admin', 'Customer'], {
      useNative: true,
      enumName: 'role',
    })
    t.jsonb('additional_info')

    // we might be able to remove the columns below depending on the auth0 implementation
    t.string('name')
    t.string('email').notNullable().unique()
    t.string('phone')
    t.date('birthdate')
    t.text('password')
  
    // standard timestamps - do not alter
    t.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'))
    t.timestamp('updated_at')
    t.boolean('deleted').defaultTo(false)
    t.uuid('created_by_id')
    t.uuid('last_updated_by_id')
  })
}

export async function down(knex: Knex): Promise<void> {

  return knex.schema.dropTableIfExists(tableName)
}

