import { Controller, Post, Headers, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { Providers } from '../conversation/entities/conversation.entity';
import { DisableGlobalAuthGuard } from 'src/decorators/decorators';
import { JwtAdapterService } from '../decorators/jwt-adapter.service';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly jwtAdapterService: JwtAdapterService,
  ) {}

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
    const customer = {
      id: '123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+5511999999999',
    };
    return this.webhookService.handleWebhook({ ...bodyWebhook, customer });
  }

  @Post('/zenvia')
  async webhookTriggerZenvia(
    @Body()
    bodyWebhook: {
      message: string;
      externalId: string;
    },
    @Headers('Authorization') token: string,
  ): Promise<any> {
    const accessToken = token.split('Bearer ')[1];
    const customer = await this.jwtAdapterService.decodeToken(accessToken);
    return this.webhookService.handleWebhook({
      ...bodyWebhook,
      customer,
      providers: Providers.ZENVIA,
    });
  }
}
