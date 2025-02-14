import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtAdapterService } from '../decorators/jwt-adapter.service';

type IUserCreate = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  type: 'Admin' | 'Customer';
  plan_type: 'free' | 'gold';
}

type IUserUpdate = {
  search?: string
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  type?: 'Admin' | 'Customer';
  ageToRetirement?: number;
  availableNetWorth?: number;
  monthlyApplication?: number;
  desiredMonthlyIncome?: number;
  deleted?: boolean;
}

type IUserGet = {
  sort?: string
  page?: number
  limit?: number
  orderBy?: string
} & IUserUpdate 

type IUser = { id: string } & IUserCreate

@Injectable()
export class UserService {
  constructor(private readonly jwtService: JwtAdapterService) {}

  async create(body: IUserCreate): Promise<User> {
    body.password = await bcrypt.hash(body.password, 10);
    return User.query().insert(body)
  }

  async findAll(getUserDto: IUserGet) {
    const {
      search,
      name,
      email,
      type,
      sort = 'desc',
      page = 0,
      limit = 10,
      orderBy = 'createdAt'
    } = getUserDto

    const query = User.query().page(page, limit)

    if (search) {
      query.where((subWhere) => {
        subWhere
          .whereRaw('LOWER(name) LIKE LOWER(?)', [`%${decodeURI(search)}%`])
          .orWhereRaw('LOWER(email) LIKE LOWER(?)', [`%${search}%`])
          // search by combination of "name (email)" to enable the initial search on user search dropdown
          // the search by only first name might not be enough in case of very common first names
          // the goal is to have the specific user show up in the first results loaded
          .orWhereRaw("LOWER(first_name || ' ' || last_name || ' (' || email || ')') LIKE LOWER(?)", [
            `%${decodeURI(search)}%`,
          ])
      })
    }

    if (name) {
      query.where('user.name', name)
    }
    if (email) {
      query.where('user.email', email)
    }
    if (type) {
      query.where('user.type', type)
    }

    const result = await query
    return result
  }

  findById(id: string) {
    return User.query().where('id', id).where('deleted', false).first();
  }

  async update(id: string, updateUserDtoRequest: IUserUpdate): Promise<User> {
    try {

      if (updateUserDtoRequest.password) {
        updateUserDtoRequest.password = await bcrypt.hash(updateUserDtoRequest.password, 10);
      }

      const updated = await User.query()
        .patch({ ...updateUserDtoRequest })
        .where('id', id)
        .returning('*')
        .first()
      if (!updated) {
        throw new NotFoundException()
      }
      return updated
    } catch (err) {
      throw new NotFoundException(err)
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const updated = await this.update(id, { deleted: true })
      if (!updated) {
        throw new NotFoundException()
      }
      return updated
    } catch (err) {
      throw new NotFoundException(err)
    }
  }

  async generateToken(user: any) {
    const payload = { ...user, sub: user.id }
    return {
      access_token: this.jwtService.generateToken(payload),
      user: user
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user: any = await User.query().where({ email, deleted: false }).first();
    if (user && user?.password && await bcrypt.compare(password, user?.password)) {
      const { password, ...result } = user;
      return this.generateToken(result)
    }
    throw new UnauthorizedException("User/password is invalid or not found user")
  }
}