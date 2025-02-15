import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { DisableGlobalAuthGuard } from 'src/decorators/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // TODO: improve types
  @Post()
  async create(@Body() user: any): Promise<any> {
    return this.userService.create(user);
  }

  @Get()
  async find(@Query() getUsersDto: any): Promise<any> {
    const page = await this.userService.findAll(getUsersDto);
    const res = {
      items: page?.results ?? [],
      total: page?.total ?? 0,
    };

    return res;
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<any> {
    return this.userService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() userUpdateDto: any,
  ): Promise<any> {
    return this.userService.update(id, userUpdateDto);
  }

  @DisableGlobalAuthGuard()
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.userService.validateUser(email, password);
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}
