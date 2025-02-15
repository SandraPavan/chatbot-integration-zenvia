import { Knex } from 'knex';

// Name of the table to be added
const tableName = 'conversation';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(tableName, (t) => {
    // uuid for all database row primary identifiers - do not alter
    t.uuid('id')
      .unique()
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));

    t.enum('providers', ['webchat', 'telegram', 'whatsapp', 'zenvia'], {
      useNative: true,
      enumName: 'providers',
    });

    t.string('external_id');

    // standard timestamps - do not alter
    t.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    t.timestamp('updated_at');
    t.boolean('deleted').defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(tableName);
}
