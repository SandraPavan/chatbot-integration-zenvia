import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { LlmService } from '../llm/llm.service';
import { ConversationService } from '../conversation/conversation.service';
import { EngineService } from '../engine/engine.service';
import { JwtAdapterService } from '../decorators/jwt-adapter.service';
import { PreferencesService } from '../preferences/preferences.service';
import { ZenviaService } from '../zenvia/zenvia.service';
@Module({
  providers: [
    WebhookService,
    LlmService,
    ConversationService,
    EngineService,
    JwtAdapterService,
    PreferencesService,
    ZenviaService,
  ],
  controllers: [WebhookController],
})
export class WebhookModule {}
