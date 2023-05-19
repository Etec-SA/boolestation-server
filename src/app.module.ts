import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { LevelStatesModule } from './level-states/level-states.module';

@Module({
  imports: [LevelStatesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
