import { Knex } from 'knex';

// Name of the table to be added
const tableName = 'preferences';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(tableName, (t) => {
    // uuid for all database row primary identifiers - do not alter
    t.uuid('id')
      .unique()
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));

    t.enum('type', ['content_model', 'integration'], {
      useNative: true,
      enumName: 'type',
    }).notNullable();

    t.jsonb('values');
    t.uuid('user_id').references('id').inTable('user').notNullable();

    // standard timestamps - do not alter
    t.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    t.timestamp('updated_at');
    t.boolean('deleted').defaultTo(false);
    t.uuid('created_by_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(tableName);
}
