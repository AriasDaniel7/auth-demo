import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return user;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }

  private handleDBError(error: any) {
    if (error.code === '23505') {
      const detail = error.detail as string;
      const match = detail.match(/\(([^)]+)\)/g);
      const field = match
        ? match[0].replace(/[()]/g, '').replace(/[""]/g, '').trim()
        : 'unknown';
      const value = match ? match[1].replace(/[()]/g, '').trim() : 'unknown';
      const message = `The ${field} '${value}' is already in use`;
      throw new BadRequestException(message);
    }

    throw new InternalServerErrorException(
      'Please check logs for more details',
    );
  }
}
