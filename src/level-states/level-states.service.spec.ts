import { Test, TestingModule } from '@nestjs/testing';
import { LevelStatesService } from './level-states.service';

describe('LevelStatesService', () => {
  let service: LevelStatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LevelStatesService],
    }).compile();

    service = module.get<LevelStatesService>(LevelStatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
