import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  imports: [AuthModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
