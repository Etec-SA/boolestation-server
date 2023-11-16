import { Test, TestingModule } from '@nestjs/testing';
import { AlternativesService } from './alternatives.service';

describe('AlternativesService', () => {
  let service: AlternativesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlternativesService],
    }).compile();

    service = module.get<AlternativesService>(AlternativesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
