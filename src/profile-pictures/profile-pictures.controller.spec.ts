import { Test, TestingModule } from '@nestjs/testing';
import { ProfilePicturesController } from './profile-pictures.controller';
import { ProfilePicturesService } from './profile-pictures.service';
import { ProfilePicture } from '@prisma/client';
import { UpdateProfilePictureDto } from './dto/update-profile-picture.dto';
import { CreateProfilePictureDto } from './dto/create-profile-picture.dto';
import { NotFoundException } from '@nestjs/common';


const InMemoryProfilePictures: Array<ProfilePicture> = [
  {
    id: '1c937b93-b38e-47dd-9fe8-a99b9802ed9e',
    title: 'Aristotle',
    url: 'http://boolestation.com/public/aristotle.png'
  },
  {
    id: '45a215cd-0ad1-48ae-89b3-cb429bf86512',
    title: 'Immanuel Kant',
    url: 'http://boolestation.com/public/kant.png'
  },
  {
    id: '2c937b93-b38e-47dd-9fe8-a99b9802ed9e',
    title: 'Russel',
    url: 'http://boolestation.com/public/russel.png'
  },
  {
    id: '3c937b93-b38e-47dd-9fe8-a99b9802ed9e',
    title: 'Frege',
    url: 'http://boolestation.com/public/frege.png'
  },
]

describe('ProfilePicturesController', () => {
  let controller: ProfilePicturesController;
  let service: ProfilePicturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilePicturesController],
      providers: [{
        provide: ProfilePicturesService,
        useValue:{
          findAll: jest.fn().mockResolvedValue(InMemoryProfilePictures),
          findOne: jest.fn((id: string) => {
            return InMemoryProfilePictures.find(item => item.id === id);
          }),
          update: jest.fn((id: string, body: UpdateProfilePictureDto) => {

            const item = InMemoryProfilePictures.find(item => item.id === id);
            const idx = InMemoryProfilePictures.indexOf(item);

            const updatedProfilePicture: ProfilePicture = {
              id,
              title: body?.title || item.title,
              url: body?.url || item.url
            };

            InMemoryProfilePictures[idx] = updatedProfilePicture;

            return updatedProfilePicture;
          }),
          create: jest.fn((body: CreateProfilePictureDto) => {

            body['id'] = crypto.randomUUID();

            InMemoryProfilePictures.push(body as ProfilePicture);

            return InMemoryProfilePictures[InMemoryProfilePictures.length - 1];
          }),
          remove: jest.fn()
        }
        }
      ],
    }).compile();

    service = module.get<ProfilePicturesService>(ProfilePicturesService);
    controller = module.get<ProfilePicturesController>(ProfilePicturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a profile picture entity successfully', async () => {
      const result = await controller.findAll();

      expect(result).toEqual(InMemoryProfilePictures);
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findAll).toHaveBeenCalledWith(/* nothing */);
    });

    it('should throw an exception', () => {
      jest.spyOn(service, 'findAll').mockRejectedValueOnce(new Error());

      expect(controller.findAll()).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('should return an individual profile picture', async () => {
      const result = await controller.findOne('1c937b93-b38e-47dd-9fe8-a99b9802ed9e');

      expect(result).toEqual(InMemoryProfilePictures[0]);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith('1c937b93-b38e-47dd-9fe8-a99b9802ed9e');
    });

    it('should return an exception when not find profile picture', async () => {
      let error: Error;
      try {
        await controller.findOne('invalid-id');
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(NotFoundException);
    });

    it('should throw an exception', () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new Error());

      expect(controller.findOne('some-id')).rejects.toThrowError();
    });
  });
});
