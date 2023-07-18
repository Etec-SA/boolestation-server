import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../database/prisma.service';
import { LevelStatesModule } from '../level-states/level-states.module';
import { ProfilePicturesModule } from '../profile-pictures/profile-pictures.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
  imports: [LevelStatesModule, ProfilePicturesModule]
})
export class UsersModule {}
