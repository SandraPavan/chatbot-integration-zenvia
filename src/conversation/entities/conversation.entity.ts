import { Model } from 'objection';
import { Content } from './content.entity';

export enum Providers {
  WEBCHAT = 'webchat',
  TELEGRAM = 'telegram',
  WHATSAPP = 'whatsapp',
  ZENVIA = 'zenvia',
}

export class Conversation extends Model {
  static tableName = 'conversation';
  id: string;
  external_id: string;
  providers: Providers;
  created_at: Date;

  contents: Content[];

  static get relationMappings() {
    return {
      contents: {
        relation: Model.HasManyRelation,
        modelClass: Content,
        join: {
          from: 'conversation.id',
          to: 'content.conversationId',
        },
      },
    };
  }
}
