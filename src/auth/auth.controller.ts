import {
  Controller,
  Post,
  Body,
  Get,
  UseInterceptors,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';

@Controller('auth')
@UseInterceptors(CacheInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateUserDto })
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({
    status: 200,
    description: 'The list of all users.',
    type: User,
    isArray: true,
  })
  @Get('users')
  @CacheKey('users')
  @CacheTTL(3600)
  findAll() {
    return this.authService.findAll();
  }

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: LoginUserDto })
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiOperation({ summary: 'Check the authentication status' })
  @ApiResponse({
    status: 200,
    description: 'You are authenticated',
  })
  @ApiBearerAuth('access-token')
  @Get('check')
  @Auth()
  @CacheKey('checkAuthStatus')
  @CacheTTL(3600)
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkUser(user);
  }

  @ApiOperation({ summary: 'Find a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully found.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBearerAuth('access-token')
  @Get('user')
  @Auth()
  @CacheKey('user')
  @CacheTTL(3600)
  findOneById(@GetUser() user: User) {
    return this.authService.findOneById(user);
  }
}
