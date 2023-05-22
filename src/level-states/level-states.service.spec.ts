import { Test, TestingModule } from '@nestjs/testing';
import { LevelStatesService } from './level-states.service';
import { PrismaService } from '../database/prisma.service'

describe('LevelStatesService', () => {
  let service: LevelStatesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LevelStatesService, PrismaService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<LevelStatesService>(LevelStatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
