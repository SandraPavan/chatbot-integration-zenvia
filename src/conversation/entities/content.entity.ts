import { Model } from 'objection';

export enum Role {
  CUSTOMER = 'customer',
  AI = 'ai',
}

export class Content extends Model {
  static tableName = 'content';
  id: string;
  conversationId: string;
  rolecontent: Role;
  message: string;

  created_at: Date;
  deleted: boolean;
}
