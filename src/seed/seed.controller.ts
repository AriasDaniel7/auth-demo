import { Controller, Get } from '@nestjs/common';

import { ValidRoles } from './../auth/interfaces/valid-roles.interface';
import { Auth } from './../auth/decorators/auth.decorator';
import { SeedService } from './seed.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiOperation({ summary: 'Seed the database' })
  @ApiResponse({
    status: 200,
    description: 'The database has been successfully seeded.',
    schema: {
      example: 'Seed executed successfully',
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth('access-token')
  @Get()
  // @Auth(ValidRoles.ADMIN)
  executeSeed() {
    return this.seedService.runSeed();
  }
}
