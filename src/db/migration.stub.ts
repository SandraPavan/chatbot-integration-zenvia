import { Knex } from 'knex'

// IMPORTANT: If you are creating a migration to modify an existing table, make sure to check if that table has a history tracking table and update it accordingly.
// Name of the table to be added
const tableName = ''

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

  await knex.schema.createTable(tableName, (t) => {
    // uuid for all database row primary identifiers - do not alter
    t.uuid('id').unique().notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'))

    // add additional columns here
    // e.g. t.string('name').notNullable()

    // standard timestamps - do not alter
    t.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'))
    t.timestamp('updated_at')
    t.boolean('deleted').defaultTo(false)
    t.uuid('created_by_id')
    t.uuid('last_updated_by_id')
  })

  // IMPORTANT: Automatically enables historical tracking in the newly created table.
  return addHistoricalTracking(knex, tableName)
}

export async function down(knex: Knex): Promise<void> {
  await removeHistoricalTracking(knex, tableName)

  return knex.schema.dropTableIfExists(tableName)
}

async function addHistoricalTracking(knex: Knex, tableName: string): Promise<void> {
  await knex.raw(`
  ALTER TABLE "${tableName}" ADD COLUMN "sys_period" tstzrange NOT NULL DEFAULT tstzrange(null, null);`)

  await knex.raw(`UPDATE "${tableName}" SET "sys_period" = tstzrange(created_at, null)`)

  const sysPeriodDefaultFunction = `
    create or replace function sys_period_default_fnc() returns trigger as $$
    begin
      new.sys_period = tstzrange(new.created_at, null);    
      return new;
    end;
    $$ language plpgsql;`

  await knex.raw(sysPeriodDefaultFunction)
  await knex.raw(`
    create trigger trig_sys_period_default
    before insert on "${tableName}" for each row
    execute procedure sys_period_default_fnc();`)

  await knex.raw(`CREATE TABLE "${tableName}_history" (LIKE "${tableName}");`)

  await knex.raw(`
    CREATE TRIGGER "${tableName}_versioning_trigger"
    BEFORE INSERT OR UPDATE OR DELETE ON "${tableName}"
    FOR EACH ROW EXECUTE PROCEDURE versioning('sys_period', '${tableName}_history', true);
`)
}

async function removeHistoricalTracking(knex: Knex, tableName: string): Promise<void> {
  await knex.raw(`
  DROP TRIGGER IF EXISTS "${tableName}_versioning_trigger"
    ON "${tableName}";
  `)

  await knex.raw(`
  DROP TRIGGER IF EXISTS "trig_sys_period_default"
    ON "${tableName}";
  `)

  await knex.schema.table(tableName, (t) => {
    t.dropColumn('sys_period')
  })

  await knex.schema.dropTableIfExists(`${tableName}_history`)
}
