import { Module } from '@nestjs/common';
import { LevelStatesService } from './level-states.service';
import { LevelStatesController } from './level-states.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [LevelStatesController],
  providers: [LevelStatesService, PrismaService]
})
export class LevelStatesModule {}
