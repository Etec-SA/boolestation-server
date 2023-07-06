import { Test, TestingModule } from '@nestjs/testing';
import { ProfilePicture } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { ProfilePicturesService } from './profile-pictures.service';
import { CreateProfilePictureDto } from './dto/create-profile-picture.dto';
import { UpdateProfilePictureDto } from './dto/update-profile-picture.dto';
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

const prismaMock = {
  profilePicture: {
    create: jest.fn(({ data }: { data: CreateProfilePictureDto }) => {
      const { title, url } = data;
      InMemoryProfilePictures.push({ id: crypto.randomUUID(), title, url });
      return InMemoryProfilePictures[InMemoryProfilePictures.length - 1];
    }),
    findMany: jest.fn().mockResolvedValue(InMemoryProfilePictures),
    findFirst: jest.fn().mockResolvedValue(InMemoryProfilePictures[0]),
    update: jest.fn().mockResolvedValue(InMemoryProfilePictures[0]),
    delete: jest.fn(),
  },
};

describe('ProfilePicturesService', () => {
  let service: ProfilePicturesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfilePicturesService,
        { provide: PrismaService, useValue: prismaMock }
      ],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<ProfilePicturesService>(ProfilePicturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of profile pictures', async () => {
      const response = await service.findAll();
      expect(response).toEqual(InMemoryProfilePictures);
      expect(prisma.profilePicture.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.profilePicture.findMany).toHaveBeenCalledWith(/* nothing */);
    });
  });

  describe('findOne', () => {
    it('should return a single profile-picture', async () => {
      const response = await service.findOne('1c937b93-b38e-47dd-9fe8-a99b9802ed9e');

      expect(response).toEqual(InMemoryProfilePictures[0]);
      expect(prisma.profilePicture.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.profilePicture.findFirst).toHaveBeenCalledWith({
        where: { id: '1c937b93-b38e-47dd-9fe8-a99b9802ed9e' },
      });
    });

    it(`should return an exception when profile picture is not found`, async () => {
      jest.spyOn(prisma.profilePicture, 'findFirst').mockResolvedValue(undefined);
      try {
        await service.findOne('1c111b93-b38e-47dd-9fe8-a99b9802ed9e');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(prisma.profilePicture.findFirst).toHaveBeenCalledTimes(2);
        expect(prisma.profilePicture.findFirst).toHaveBeenCalledWith({
          where: { id: '1c111b93-b38e-47dd-9fe8-a99b9802ed9e' },
        });
      }
    });
  });


  describe('create', () => {
    it('should create a new profile-picture and return it', async () => {
      const oldArraySize = InMemoryProfilePictures.length;

      const newProfilePicture: CreateProfilePictureDto = {
        title: 'Aquinas',
        url: 'http://boolestation.com/aquinas.png'
      }

      const createdProfilePicture = await service.create(newProfilePicture);

      expect(createdProfilePicture).toBeDefined();
      expect(createdProfilePicture.id).toBeDefined();
      expect(createdProfilePicture.title).toEqual(newProfilePicture.title);
      expect(createdProfilePicture.url).toEqual(newProfilePicture.url);

      expect(prisma.profilePicture.create).toHaveBeenCalledTimes(1);
      expect(prisma.profilePicture.create).toHaveBeenCalledWith({ data: { ...newProfilePicture } });

      expect(InMemoryProfilePictures.length).toBeGreaterThan(oldArraySize);
    });

    it('should throw an error if the profile-picture creation fails', async () => {
      const oldArraySize = InMemoryProfilePictures.length;

      const newProfilePicture: CreateProfilePictureDto = {
        title: 'Aquinas',
        url: 'http://boolestation.com/aquinas.png'
      }

      jest.spyOn(prisma.profilePicture, 'create').mockRejectedValueOnce(new Error('Failed to create profile picture'));

      await expect(service.create(newProfilePicture)).rejects.toThrowError('Failed to create profile picture');
      expect(prisma.profilePicture.create).toHaveBeenCalledTimes(2);
      expect(prisma.profilePicture.create).toHaveBeenCalledWith({ data: { ...newProfilePicture } });
      expect(InMemoryProfilePictures.length).not.toBeGreaterThan(oldArraySize);
    });
  });

  describe('update', () => {

    it('should update an existing profile picture and return the updated profile picture', async () => {
      const existingProfilePicture: ProfilePicture = InMemoryProfilePictures[0];

      const updatedProfilePictureData: UpdateProfilePictureDto = {
        title: 'Aristóteles',
        url: 'http://bool.com.br/aristoteles'
      };

      const updatedProfilePicture: ProfilePicture = {
        id: '1c937b93-b38e-47dd-9fe8-a99b9802ed9e',
        title: 'Aristotle',
        url: 'http://bool.com.br/aristoteles'
      };

      jest.spyOn(prisma.profilePicture, 'update').mockResolvedValueOnce(updatedProfilePicture);

      const result = await service.update(existingProfilePicture.id, updatedProfilePictureData);

      expect(result).toEqual(updatedProfilePicture);
      expect(prisma.profilePicture.update).toHaveBeenCalledTimes(1);
      expect(prisma.profilePicture.update).toHaveBeenCalledWith({
        where: { id: existingProfilePicture.id },
        data: updatedProfilePictureData,
      });
    });

    it('should throw an error if the profile picture does not exist', async () => {
      const nonExistingProfilePictureId = 'non-existing-id';
      const updatedProfilePictureData: UpdateProfilePictureDto = {
        title: 'Kant',
        url: 'transcendental.com'
      };

      jest.spyOn(prisma.profilePicture, 'update').mockRejectedValueOnce(new Error());

      await expect(service.update(nonExistingProfilePictureId, updatedProfilePictureData)).rejects.toThrowError();
      expect(prisma.profilePicture.update).toHaveBeenCalledTimes(2);
      expect(prisma.profilePicture.update).toHaveBeenCalledWith({
        where: { id: nonExistingProfilePictureId },
        data: updatedProfilePictureData,
      });
    });

    it('should handle errors during update', async () => {
      const existingProfilePicture: ProfilePicture = InMemoryProfilePictures[0];

      const updatedProfilePictureData: UpdateProfilePictureDto = {
        title: 'Aristotle',
        url: 'http://aristotlelovers.com/picture.png'
      };

      const updateError = new Error('Failed to update profile picture');

      jest.spyOn(prisma.profilePicture, 'update').mockRejectedValueOnce(updateError);

      await expect(service.update(existingProfilePicture.id, updatedProfilePictureData)).rejects.toThrowError(updateError);
      expect(prisma.profilePicture.update).toHaveBeenCalledTimes(3);
      expect(prisma.profilePicture.update).toHaveBeenCalledWith({
        where: { id: existingProfilePicture.id },
        data: updatedProfilePictureData,
      });
    });
  });

  describe('remove', () => {
    it('should remove an existing profile picture', async () => {
      const existingProfilePictureId = '1c937b93-b38e-47dd-9fe8-a99b9802ed9e';

      jest.spyOn(prisma.profilePicture, 'delete').mockResolvedValueOnce(existingProfilePictureId as unknown as ProfilePicture);

      const result = await service.remove(existingProfilePictureId);

      expect(result).toEqual(existingProfilePictureId);
      expect(prisma.profilePicture.delete).toHaveBeenCalledTimes(1);
      expect(prisma.profilePicture.delete).toHaveBeenCalledWith({ where: { id: existingProfilePictureId } });
    });

    it('should throw an error if the profile picture to remove does not exist', async () => {
      const nonExistingProfilePictureId = 'non-existing-id';

      jest.spyOn(prisma.profilePicture, 'delete').mockRejectedValue(new Error('profile picture not found'));

      await expect(service.remove(nonExistingProfilePictureId)).rejects.toThrowError('profile picture not found');
      expect(prisma.profilePicture.delete).toHaveBeenCalledTimes(2);
      expect(prisma.profilePicture.delete).toHaveBeenCalledWith({ where: { id: nonExistingProfilePictureId } });
    });
  });
});
