import { Injectable } from '@nestjs/common';
import { EngineService } from '../engine/engine.service';
import { Providers } from 'src/conversation/entities/conversation.entity';

@Injectable()
export class WebhookService {
  constructor(private readonly engineService: EngineService) {}

  async handleWebhook(bodyWebhook: {
    message: string;
    externalId: string;
    customer: any;
    from: string;
    to: string;
    providers: Providers;
    channel: string;
  }): Promise<any> {
    const engineManagerConversation = await this.engineService.man(bodyWebhook);
    return engineManagerConversation;
  }
}
