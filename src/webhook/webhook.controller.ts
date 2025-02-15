import { Controller, Post, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { DisableGlobalAuthGuard } from '../decorators/decorators';
import { Providers } from '../conversation/entities/conversation.entity';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  @DisableGlobalAuthGuard()
  async webhookTrigger(
    @Body()
    bodyWebhook: {
      message: string;
      externalId: string;
      providers: Providers;
    },
  ): Promise<any> {
    return this.webhookService.handleWebhook(bodyWebhook);
  }
}
