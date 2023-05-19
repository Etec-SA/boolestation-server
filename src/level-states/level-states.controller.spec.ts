import { Test, TestingModule } from '@nestjs/testing';
import { LevelStatesController } from './level-states.controller';
import { LevelStatesService } from './level-states.service';

describe('LevelStatesController', () => {
  let controller: LevelStatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LevelStatesController],
      providers: [LevelStatesService],
    }).compile();

    controller = module.get<LevelStatesController>(LevelStatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
