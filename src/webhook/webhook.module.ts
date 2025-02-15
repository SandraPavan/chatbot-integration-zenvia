import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { LlmService } from '../llm/llm.service';
import { ConversationService } from '../conversation/conversation.service';

@Module({
  providers: [WebhookService, LlmService, ConversationService],
  controllers: [WebhookController],
})
export class WebhookModule {}
