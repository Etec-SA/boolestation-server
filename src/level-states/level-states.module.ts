import { Module } from '@nestjs/common';
import { LevelStatesService } from './level-states.service';
import { LevelStatesController } from './level-states.controller';

@Module({
  controllers: [LevelStatesController],
  providers: [LevelStatesService]
})
export class LevelStatesModule {}
