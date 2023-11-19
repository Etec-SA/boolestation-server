import { Test, TestingModule } from '@nestjs/testing';
import { AlternativesController } from './alternatives.controller';
import { AlternativesService } from './alternatives.service';

describe('AlternativesController', () => {
  let controller: AlternativesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlternativesController],
      providers: [AlternativesService],
    }).compile();

    controller = module.get<AlternativesController>(AlternativesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
