import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

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
