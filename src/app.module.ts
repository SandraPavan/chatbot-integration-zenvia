import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { KnexModule } from '@nestjsplus/knex';
import { AuthorizationModule } from './decorators/authorization.module';
import { ConversationModule } from './conversation/conversation.module';
import { WebhookModule } from './webhook/webhook.module';
import { LlmModule } from './llm/llm.module';

@Module({
  imports: [
    KnexModule.register({
      client: 'postgresql',
      connection: {
        host: process.env.DEV_DB_URL || 'localhost',
        port: 5432,
        user: process.env.DEV_DB_USERNAME,
        password: process.env.DEV_DB_PASSWORD,
        database: process.env.DEV_DB_DATABASE,
      },
    }),
    UserModule,
    AuthorizationModule.forRootAsync(),
    ConversationModule,
    WebhookModule,
    LlmModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})

export class AppModule {}
