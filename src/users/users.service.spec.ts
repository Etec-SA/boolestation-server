import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const prismaMock = {
  user: {
    create: jest.fn((data: CreateUserDto) => {
      return {
        ...data,
        id: crypto.randomUUID(),
        xp: 0,
        isPremium: false
      };
    }),
    findFirst: jest.fn(() => {
      return {
        name: 'user',
        username: 'user',
        email: 'user@email.com',
        password: 'user',
        birthdate: new Date('')
      }
    }),
    findMany: jest.fn().mockResolvedValue([
      {
        name: 'user',
        username: 'user',
        email: 'user@email.com',
        password: 'user',
        birthdate: new Date('')
      }
    ]),
    delete: jest.fn()
  },
  profilePicture: {
    findFirst: jest.fn().mockResolvedValue(crypto.randomUUID())
  },
  levelState: {
    findFirst: jest.fn().mockResolvedValue(crypto.randomUUID())
  }
}

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService,
        { provide: PrismaService, useValue: prismaMock }
      ],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expected = JSON.stringify([
        {
          name: 'user',
          username: 'user',
          email: 'user@email.com',
          password: 'user',
          birthdate: new Date('')
        }
      ]);

      const response = await service.findAll();
      expect(JSON.stringify(response)).toEqual(expected);
      expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.user.findMany).toHaveBeenCalledWith(/* nothing */);
    });
  });

  describe('create', () => {
    it('should create an user with a hashed password', async () => {
      const user: CreateUserDto = {
        birthdate: new Date('1985-10-10'),
        name: 'George Bool',
        email: 'george@bool.com',
        password: '123321',
        username: 'georgebool'
      };

      jest.spyOn(prisma.user, 'findFirst').mockResolvedValueOnce(undefined);

      jest.spyOn(bcrypt, 'hash').mockImplementation((pass, salt) => {
        Promise.resolve('');
      });

      const response = await service.create(user);

      expect(response).toBeDefined();
      expect(response.id).toBeDefined();
      expect(response?.password).toBeUndefined();
      expect(response.xp).toBe(0);
      expect(response.isPremium).toBe(false);
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception if email is already in use', async () => {
      const user: CreateUserDto = {
        birthdate: new Date('1985-10-10'),
        name: 'Bool George',
        email: 'george@bool.com',
        password: '123321',
        username: 'boolgeorge'
      };

      jest.spyOn(prisma.user, 'findFirst').mockResolvedValueOnce({
        username: 'boolgeorge2',
        email: 'george@bool.com'
      } as User);

      try {
        await service.create(user);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toEqual('Email is already in use.');

      }
    });

    it('should throw an exception if username is already in use', async () => {
      const user: CreateUserDto = {
        birthdate: new Date('1985-10-10'),
        name: 'Bool George',
        email: 'george@boolean.com',
        password: '123321',
        username: 'georgebool'
      };

      jest.spyOn(prisma.user, 'findFirst').mockResolvedValueOnce({
        username: 'georgebool',
        email: 'georgebool@gmail.com'
      } as User);

      try {
        await service.create(user);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toEqual('Username is already in use.');
      }
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const response = await service.findOne('1c937b93-b38e-47dd-9fe8-a99b9802ed9e');
      const expected = JSON.stringify({
        name: 'user',
        username: 'user',
        email: 'user@email.com',
        password: 'user',
        birthdate: new Date('0000-00-00')
      });

      expect(JSON.stringify(response)).toEqual(expected);
      expect(prisma.user.findFirst).toHaveBeenCalledTimes(4);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { id: '1c937b93-b38e-47dd-9fe8-a99b9802ed9e' },
      });
    });

    it(`should return an exception when user is not found`, async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(undefined);
      
      try {
        await service.findOne('1c111b93-b38e-47dd-9fe8-a99b9802ed9e');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(prisma.user.findFirst).toHaveBeenCalledTimes(5);
        expect(prisma.user.findFirst).toHaveBeenCalledWith({
          where: { id: '1c111b93-b38e-47dd-9fe8-a99b9802ed9e' },
        });
      }
      
    });
  });

  describe('remove', () => {
    it('should remove an existing user', async () => {
      const existingUserId = '1c937b93-b38e-47dd-9fe8-a99b9802ed9e';

      jest.spyOn(prisma.user, 'delete').mockResolvedValueOnce({id: existingUserId} as any);

      const result = await service.remove(existingUserId);

      expect(result.id).toEqual(existingUserId);
      expect(result?.password).toBeUndefined();
      expect(prisma.user.delete).toHaveBeenCalledTimes(1);
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: existingUserId } });
    });

    it('should throw an error if the user to remove does not exist', async () => {
      const nonExistingUserId = 'non-existing-id';

      jest.spyOn(prisma.user, 'delete').mockRejectedValue(new Error('profile picture not found'));

      await expect(service.remove(nonExistingUserId)).rejects.toThrowError('profile picture not found');
      expect(prisma.user.delete).toHaveBeenCalledTimes(2);
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: nonExistingUserId } });
    });

  });
});
