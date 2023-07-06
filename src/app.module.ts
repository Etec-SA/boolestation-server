import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { LevelStatesModule } from './level-states/level-states.module';
import { ProfilePicturesModule } from './profile-pictures/profile-pictures.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [LevelStatesModule, ProfilePicturesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
