import { CustomDecorator, SetMetadata } from '@nestjs/common'

export const DisableGlobalAuthGuard = (): CustomDecorator<'disableGlobalAuthGuard'> =>
  SetMetadata('disableGlobalAuthGuard', true)