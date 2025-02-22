import { Module } from '@nestjs/common';
import { EngineService } from './engine.service';
import { LlmService } from '../llm/llm.service';
import { ConversationService } from '../conversation/conversation.service';
import { PreferencesService } from '../preferences/preferences.service';
import { ZenviaService } from '../zenvia/zenvia.service';

@Module({
  providers: [
    EngineService,
    LlmService,
    ConversationService,
    PreferencesService,
    ZenviaService,
  ],
})
export class EngineModule {}
