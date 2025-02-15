import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { Providers } from '../conversation/entities/conversation.entity';
import { ConversationService } from '../conversation/conversation.service';
import { Role } from '../conversation/entities/content.entity';

@Injectable()
export class WebhookService {
  constructor(
    private readonly llmService: LlmService,
    private readonly conversationService: ConversationService,
  ) {}

  async handleWebhook(bodyWebhook: {
    message: string;
    externalId: string;
    providers: Providers;
  }): Promise<any> {
    const conversations = await this.conversationService.findAll({
      externalId: bodyWebhook.externalId,
      providers: bodyWebhook.providers,
    });
    let conversation = conversations[0];

    if (!conversation) {
      conversation = await this.conversationService.create({
        externalId: bodyWebhook.externalId,
        providers: bodyWebhook.providers,
      });
    }

    conversation = await this.conversationService.createContent({
      conversationId: conversation.id,
      rolecontent: Role.CUSTOMER,
      message: bodyWebhook.message,
    });

    const responseMessage = await this.llmService.handleLLM(
      bodyWebhook.message,
      conversation?.contents || [],
    );

    await this.conversationService.createContent({
      conversationId: conversation.id,
      rolecontent: Role.AI,
      message: responseMessage,
    });

    return { message: responseMessage };
  }
}
