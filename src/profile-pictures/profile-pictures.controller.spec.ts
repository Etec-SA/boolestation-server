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
        useValue: {
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

    it('should return undefined when not find profile picture', async () => {
      const result = await controller.findOne('invalid-id');
      expect(result).toBeUndefined();
    });

    it('should throw an exception', () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new Error());

      expect(controller.findOne('some-id')).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should create a profile picture successfully', async () => {
      const body: CreateProfilePictureDto = {
        title: 'Kant',
        url: 'kant.com/picture'
      }

      const result = await controller.create(body);

      expect(result).toBeDefined();
      expect(result).toEqual(InMemoryProfilePictures[InMemoryProfilePictures.length - 1]);
      expect(typeof result).toEqual(typeof InMemoryProfilePictures[0]);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(body);
    });

    it('should throw an exception', () => {
      const body: CreateProfilePictureDto = {
        title: 'Kant',
        url: 'kant.com/picture'
      }

      jest.spyOn(service, 'create').mockRejectedValueOnce(new Error());

      expect(controller.create(body)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a profile picture', async () => {
      const body: UpdateProfilePictureDto = {
        title: 'O Modalista',
        url: 'themodalist.com/picture.png'
      }

      const existingProfilePicture = InMemoryProfilePictures[0];

      const result = await controller.update(existingProfilePicture.id, body);

      expect(result).toBeDefined();
      expect(result).toEqual(InMemoryProfilePictures[0]);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(existingProfilePicture.id, body);
    });

    it('should return undefined when not find profile picture', async () => {

      const body: UpdateProfilePictureDto = {
        title: 'O Modalista',
        url: 'themodalist.com/picture.png'
      }

      jest.spyOn(service, 'update').mockResolvedValueOnce(undefined);
      const result = await controller.update('not-a-valid-id', body);

      expect(result).toBeUndefined();
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith('not-a-valid-id', body);
    });

    it('should throw an exception', () => {
      const body: UpdateProfilePictureDto = {
        title: 'O Modalista',
        url: 'themodalist.com/picture.png'
      }

      jest.spyOn(service, 'update').mockRejectedValueOnce(new Error());

      expect(controller.update('some-id', body)).rejects.toThrowError();
    });
  });

  describe('delete', () => {
    it('should remove an existing profile picture', async () => {
      const existingProfilePictureId = '1c937b93-b38e-47dd-9fe8-a99b9802ed9e';

      jest.spyOn(service, 'remove').mockResolvedValueOnce(existingProfilePictureId as unknown as ProfilePicture);

      const result = await controller.remove(existingProfilePictureId);

      expect(result).toEqual(existingProfilePictureId);
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(existingProfilePictureId);
    });

    it('should throw an error if the profile picture to remove does not exist', async () => {
      const nonExistingProfilePictureId = 'non-existing-id';

      jest.spyOn(service, 'remove').mockRejectedValueOnce(new Error('profile picture not found'));

      await expect(controller.remove(nonExistingProfilePictureId)).rejects.toThrowError('profile picture not found');
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(nonExistingProfilePictureId);
    });

    it('should throw an exception', () => {

      jest.spyOn(service, 'remove').mockRejectedValueOnce(new Error());

      expect(controller.remove('some-id')).rejects.toThrowError();

    });
  });
});
