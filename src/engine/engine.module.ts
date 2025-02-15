import { Module } from '@nestjs/common';
import { EngineService } from './engine.service';
import { LlmService } from '../llm/llm.service';
import { ConversationService } from '../conversation/conversation.service';

@Module({
  providers: [EngineService, LlmService, ConversationService],
})
export class EngineModule {}
