import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

const serviceMock = {
  create: jest.fn((data: CreateUserDto) => {
    const user: User = {
      id: crypto.randomUUID(),
      xp: 0,
      isPremium: false,
      levelStateId: crypto.randomUUID(),
      profilePictureId: crypto.randomUUID(),
      createdAt: new Date('2000-12-12'),
      updatedAt: new Date('2023-07-09'),
      ...data,
      password: undefined
    }
    return user;
  }),
  remove: jest.fn(),
  findOne: jest.fn().mockResolvedValue({
    name: 'user',
    username: 'user',
    email: 'user@email.com',
    password: 'user',
    birthdate: new Date('')
  })
}

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{
        provide: UsersService,
        useValue: serviceMock
      }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an user with success', async () => {
      const response: User = await controller.create({
        name: 'Luca Poe',
        birthdate: new Date('2006-01-19'),
        email: 'lucapoe@bool.com',
        password: 'iamthepoe',
        username: 'lucapoe'
      });

      expect(response).toBeDefined();
      expect(response?.password).toBeUndefined();
    });

    it('should return an error if email is already in use', async () => {
      jest.spyOn(service, 'create').mockRejectedValueOnce(new BadRequestException('Email is already in use.'));
      try {
        await controller.create({
          name: 'Luca Poe',
          birthdate: new Date('2006-01-19'),
          email: 'lucapoe@bool.com',
          password: 'iamthepoe',
          username: 'lucapoe'
        });
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toEqual('Email is already in use.');
      }
    });

    it('should return an error if username is already in use', async () => {
      jest.spyOn(service, 'create').mockRejectedValueOnce(new BadRequestException('Username is already in use.'));
      try {
        await controller.create({
          name: 'Luca Poe',
          birthdate: new Date('2006-01-19'),
          email: 'lucapoe@bool.com',
          password: 'iamthepoe',
          username: 'lucapoe'
        });
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toEqual('Username is already in use.');
      }
    });
  });

  describe('findOne', () => {
    it('should return an individual user', async () => {
      const result = await controller.findOne('1c937b93-b38e-47dd-9fe8-a99b9802ed9e');
      const expected =  JSON.stringify({
        name: 'user',
        username: 'user',
        email: 'user@email.com',
        password: 'user',
        birthdate: new Date('')
      });

      expect(JSON.stringify(result)).toEqual(expected);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith('1c937b93-b38e-47dd-9fe8-a99b9802ed9e');
    });

    it('should throw an exception', () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new Error());

      expect(controller.findOne('some-id')).rejects.toThrowError();
    });
  });

  describe('delete', () => {
    it('should remove an existing user', async () => {
      const existingUserId = '1c937b93-b38e-47dd-9fe8-a99b9802ed9e';

      jest.spyOn(service, 'remove').mockResolvedValueOnce(existingUserId as any);

      const result = await controller.remove(existingUserId);

      expect(result).toEqual(existingUserId);
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(existingUserId);
    });

    it('should throw an error if the user to remove does not exist', async () => {
      const nonExistingUserId = 'non-existing-id';

      jest.spyOn(service, 'remove').mockRejectedValueOnce(new Error('user not found'));

      await expect(controller.remove(nonExistingUserId)).rejects.toThrowError('user not found');
      expect(service.remove).toHaveBeenCalledTimes(2);
      expect(service.remove).toHaveBeenCalledWith(nonExistingUserId);
    });

    it('should throw an exception', () => {

      jest.spyOn(service, 'remove').mockRejectedValueOnce(new Error());

      expect(controller.remove('some-id')).rejects.toThrowError();

    });
  });
});
