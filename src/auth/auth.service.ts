import { LoginUserDto } from './dto/login-user.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { isUUID } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid are not valid (email) credentials',
      );
    }

    if (!bcrypt.compareSync(password, user.password!)) {
      throw new UnauthorizedException(
        'Invalid are not valid (password) credentials',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }

    delete user.password;

    const token = this.getJwtToken({ id: user.id });

    return {
      ...token,
    };
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async checkUser(user: User) {
    const { id } = user;
    const token = this.getJwtToken({ id });
    return {
      ...token,
    };
  }

  async findOneById(user: User) {
    return user;
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

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    const decode = this.jwtService.decode(token);
    delete decode.id;

    return {
      token,
      iat: decode.iat,
      exp: decode.exp,
    };
  }
}
