import { Injectable } from '@nestjs/common';
import { Providers } from '../conversation/entities/conversation.entity';
import { EngineService } from '../engine/engine.service';

@Injectable()
export class WebhookService {
  constructor(private readonly engineService: EngineService) {}

  async handleWebhook(bodyWebhook: {
    message: string;
    externalId: string;
    providers: Providers;
  }): Promise<any> {
    const engineManagerConversation = await this.engineService.man(bodyWebhook);
    return engineManagerConversation;
  }
}
