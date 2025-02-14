import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtAdapterService } from './jwt-adapter.service'

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly jwtAdapterService: JwtAdapterService,
    /**
     * FIXME: using @Inject(Reflector.name) masks possible versions mismatches [1]
     *  between nestjs packages. But there's a bigger issue here that is still
     *  unknown and needed this workaround.
     *
     * [1] https://github.com/nestjs/nest/issues/7583#issuecomment-883324366
     */
    @Inject(Reflector.name) private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isDisableGlobalAuthGuard = this.reflector.get<boolean>('disableGlobalAuthGuard', context.getHandler())

    if (isDisableGlobalAuthGuard) {
      return true
    }
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization && request.headers.authorization;
    const accessToken = token.split('Bearer ')[1]

    if (!accessToken) {
      console.log('No Access token provided')
      return false
    }

    try {
      await this.jwtAdapterService.validate(accessToken)

      return true
    } catch (error) {
      throw new UnauthorizedException(error)
    }
  }
}
