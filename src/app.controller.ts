import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DisableGlobalAuthGuard } from './decorators/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @DisableGlobalAuthGuard()
  getHello(): string {
    return this.appService.getHello();
  }
}
