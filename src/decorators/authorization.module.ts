import { DynamicModule } from '@nestjs/common'
import { APP_GUARD, Reflector } from '@nestjs/core'
import { AuthorizationGuard } from './authorization.guard'
import { JwtAdapterService } from './jwt-adapter.service'
import { ConfigModule, ConfigService } from '@nestjs/config'

export class AuthorizationModule {
  static async forRootAsync(): Promise<DynamicModule> {
    return {
      module: AuthorizationModule,
      imports: [ConfigModule],
      providers: [
        ConfigService,
        Reflector,

        {
          provide: APP_GUARD,
          useClass: AuthorizationGuard,
        },
        JwtAdapterService,
      ],
    }
  }
}
