import { Controller, Post, Headers, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { Providers } from '../conversation/entities/conversation.entity';
import { JwtAdapterService } from '../decorators/jwt-adapter.service';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly jwtAdapterService: JwtAdapterService,
  ) {}

  @Post('/zenvia')
  async webhookTriggerZenvia(
    @Body()
    bodyWebhook: any,
    @Headers('Authorization') token: string,
  ): Promise<any> {
    const accessToken = token.split('Bearer ')[1];
    const customer = await this.jwtAdapterService.decodeToken(accessToken);
    return this.webhookService.handleWebhook({
      externalId: bodyWebhook.id,
      message: bodyWebhook.message.contents[0].text,
      customer,
      providers: Providers.ZENVIA,
      from: bodyWebhook.message.from,
      to: bodyWebhook.message.to,
    });
  }
}
