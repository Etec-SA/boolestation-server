import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { LevelStatesModule } from './level-states/level-states.module';
import { ProfilePicturesModule } from './profile-pictures/profile-pictures.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [LevelStatesModule, ProfilePicturesModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService,
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard
  },
  {
    provide: APP_GUARD,
    useClass: RolesGuard
  }
  ],
})
export class AppModule {}
