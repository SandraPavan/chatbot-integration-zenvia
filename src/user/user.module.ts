import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { JwtAdapterService } from '../decorators/jwt-adapter.service'

@Module({
  controllers: [UserController],
  providers: [UserService, JwtAdapterService],
  exports: [UserService],
})
export class UserModule {}
