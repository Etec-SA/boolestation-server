import { Test, TestingModule } from '@nestjs/testing';
import { ProfilePicturesController } from './profile-pictures.controller';
import { ProfilePicturesService } from './profile-pictures.service';

describe('ProfilePicturesController', () => {
  let controller: ProfilePicturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilePicturesController],
      providers: [ProfilePicturesService],
    }).compile();

    controller = module.get<ProfilePicturesController>(ProfilePicturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
