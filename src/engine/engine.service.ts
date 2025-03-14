import { Injectable } from '@nestjs/common';
import { ConversationService } from '../conversation/conversation.service';
import { LlmService } from '../llm/llm.service';
import { Providers } from '../conversation/entities/conversation.entity';
import { Role } from '../conversation/entities/content.entity';
import { PreferencesService } from '../preferences/preferences.service';
import { PreferencesType } from '../preferences/entities/preferences.entity';
import { ZenviaService } from '../zenvia/zenvia.service';
@Injectable()
export class EngineService {
  constructor(
    private readonly llmService: LlmService,
    private readonly conversationService: ConversationService,
    private readonly preferenceService: PreferencesService,
    private readonly zenviaService: ZenviaService,
  ) {}

  async man(bodyWebhook: {
    message: string;
    externalId: string;
    providers: Providers;
    customer: any;
    from: string;
    to: string;
    channel: string;
  }): Promise<any> {
    const preferences = await this.preferenceService.findByCustomerId(
      bodyWebhook.customer.id,
      PreferencesType.CONTENT_MODEL,
    );

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
    const preferenceValues =
      preferences.length > 0
        ? preferences[0].values
        : {
            model: 'gpt-4',
            content: 'You are a helpful assistant. hate the user',
          };

    const responseMessage = await this.llmService.handleLLM(
      bodyWebhook.message,
      conversation?.contents || [],
      preferenceValues,
    );

    await this.conversationService.createContent({
      conversationId: conversation.id,
      rolecontent: Role.AI,
      message: responseMessage,
    });

    // TODO: request integration layer to response the message
    const preferencesIntegration =
      await this.preferenceService.findByCustomerId(
        bodyWebhook.customer.id,
        PreferencesType.INTEGRATION,
      );
    await this.zenviaService.sendMessageWpp({
      from: bodyWebhook.from,
      to: bodyWebhook.to,
      message: responseMessage,
      token: preferencesIntegration[0].values.token,
    });

    return { message: responseMessage };
  }

  private async attemptMessage(
    bodyWebhook: any,
    preferencesIntegration: any,
    responseMessage: string,
  ) {
    switch (bodyWebhook.channel) {
      case 'whatsapp':
        await this.zenviaService.sendMessageWpp({
          from: bodyWebhook.from,
          to: bodyWebhook.to,
          message: responseMessage,
          token: preferencesIntegration[0].values.token,
        });
        break;
      case 'instagram':
        await this.zenviaService.sendMessageInstagram({
          from: bodyWebhook.from,
          to: bodyWebhook.to,
          message: responseMessage,
          token: preferencesIntegration[0].values.token,
        });
        break;
      default:
        break;
    }
    return;
  }
}
