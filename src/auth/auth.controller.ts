import { Controller, Post, Body, Get, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

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
}
