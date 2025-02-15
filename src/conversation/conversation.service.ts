import { Injectable } from '@nestjs/common';
import { Conversation, Providers } from './entities/conversation.entity';
import { Content, Role } from './entities/content.entity';

@Injectable()
export class ConversationService {
  async findAll(params: {
    id?: string;
    externalId?: string;
    providers?: Providers;
  }) {
    const query = Conversation.query().withGraphJoined('contents');
    if (params.id) {
      query.where('id', params.id);
    }
    if (params.externalId) {
      query.where('external_id', params.externalId);
    }
    if (params.providers) {
      query.where('providers', params.providers);
    }

    const conversations = await query;
    return conversations;
  }

  async create(conversation: {
    externalId: string;
    providers: Providers;
  }): Promise<Conversation> {
    const newConversation = await Conversation.query().insert(conversation);
    return newConversation;
  }

  async findById(id: string): Promise<Conversation> {
    const conversation = await Conversation.query()
      .withGraphJoined('contents')
      .findById(id);
    return conversation;
  }

  async createContent(content: {
    conversationId: string;
    rolecontent: Role;
    message: string;
  }): Promise<Conversation> {
    await Content.query().insert(content);

    const conversation = await this.findById(content.conversationId);
    return conversation;
  }
}
