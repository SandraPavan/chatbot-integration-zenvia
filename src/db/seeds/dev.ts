import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';
import { PreferencesType } from '../../preferences/entities/preferences.entity';

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

  await knex('user').insert([
    {
      name: 'Customer 1',
      email: 'customer1@ecommerce.com',
      password: password,
      phone: '1231231231',
      type: 'Customer',
    },
  ]);

  const customer = await knex('user').where('email', 'customer1@ecommerce.com');
  await knex('preferences').insert([
    {
      type: PreferencesType.CONTENT_MODEL,
      values: {
        model: 'gpt-4',
        content: `Relâmpago Marquinhos is an intelligent chatbot designed to help users validate car prices across multiple websites efficiently. Built with advanced web-scraping and automation technologies, it scans the inputted websites, extracts relevant vehicle pricing information, and compares them to market standards to ensure accuracy.

          Key Features:
          🚗 Website Input & Scraping – Users provide website URLs, and Relâmpago Marquinhos retrieves car price details automatically.
          🔍 Real-Time Price Validation – The chatbot analyzes and cross-references prices to identify inconsistencies or potential scams.
          📊 Comparative Analysis – It compares prices across different listings and provides insights on fair market value.
          📢 Alerts & Recommendations – Users receive notifications if a price appears suspiciously low or high.
          ⚡ Fast & Efficient – Designed for quick responses, making the validation process seamless and user-friendly.

          With Relâmpago Marquinhos, car buyers and sellers can confidently verify vehicle prices before making a decision, ensuring transparency and smarter purchasing choices.
          research the car price on websites you can use this website https://veiculos.fipe.org.br/ and return only 3 values
          
          What you can't do it:
          * You can't return/response a JSON
          * Before answer the question, you should research the car price on websites you can use this website https://veiculos.fipe.org.br/ and return only 3 values
          * max of 100 characters
          `,
      },
      user_id: customer[0].id,
    },
  ]);
}
