import { Test, TestingModule } from '@nestjs/testing';
import { ProfilePicture } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { ProfilePicturesService } from './profile-pictures.service';
import { CreateProfilePictureDto } from './dto/create-profile-picture.dto';

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

    it('should throw an error if the level state creation fails', async () => {
      const oldArraySize = InMemoryProfilePictures.length;

      const newProfilePicture: CreateProfilePictureDto = {
        title: 'Aquinas',
        url: 'http://boolestation.com/aquinas.png'
      }

      jest.spyOn(prisma.profilePicture, 'create').mockRejectedValueOnce(new Error('Failed to create level state'));

      await expect(service.create(newProfilePicture)).rejects.toThrowError('Failed to create level state');
      expect(prisma.profilePicture.create).toHaveBeenCalledTimes(2);
      expect(prisma.profilePicture.create).toHaveBeenCalledWith({ data: { ...newProfilePicture } });
      expect(InMemoryProfilePictures.length).not.toBeGreaterThan(oldArraySize);
    });

  });

});
