import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  const password = await bcrypt.hash('Password123@test', 10);
  await knex('user').insert([
    {
      name: 'User Test',
      email: 'usertest@test.com',
      password: password,
      phone: '14996696169',
      type: 'Admin',
    },
  ]);
}
