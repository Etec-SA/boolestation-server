import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthRequest } from 'src/auth/entities/auth-request.entity';

const serviceMock = {
  create: jest.fn((data: CreateUserDto) => {
    const user: User = {
      id: crypto.randomUUID(),
      xp: 0,
      isPremium: false,
      isAdmin: false,
      levelStateId: crypto.randomUUID(),
      profilePictureId: crypto.randomUUID(),
      createdAt: new Date('2000-12-12'),
      updatedAt: new Date('2023-07-09'),
      ...data,
      password: undefined
    }
    return user;
  }),
  findAll: jest.fn().mockResolvedValue([
    {
      name: 'user',
      username: 'user',
      email: 'user@email.com',
      password: 'user',
      birthdate: new Date('')
    }
  ]),
  remove: jest.fn(),
  findOne: jest.fn().mockResolvedValue({
    name: 'user',
    username: 'user',
    email: 'user@email.com',
    password: 'user',
    birthdate: new Date('')
  }),
  update: jest.fn().mockResolvedValue({
    name: 'userUpdated',
    username: 'user',
    email: 'user@email.com',
    password: undefined,
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

  describe('findAll', () => {
    it('should return users successfully', async () => {
      const expected = JSON.stringify([
        {
          name: 'user',
          username: 'user',
          email: 'user@email.com',
          password: 'user',
          birthdate: new Date('')
        }
      ]);

      const result = await controller.findAll();

      expect(JSON.stringify(result)).toEqual(expected);
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findAll).toHaveBeenCalledWith(/* nothing */);
    });

    it('should throw an exception', () => {
      jest.spyOn(service, 'findAll').mockRejectedValueOnce(new Error());

      expect(controller.findAll()).rejects.toThrowError();
    });
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
      expect(service.create).toBeCalledTimes(1);
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

  describe('update', () => {
    it('should update an user with success', async () => {
      const update: UpdateUserDto = {
        name: 'userUpdated'
      };

      const response = await controller.update(update, { user: { id: 'some-id' } } as any as AuthRequest);

      expect(response).toBeDefined();
      expect(response?.password).toBeUndefined();
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      jest.spyOn(service, 'update')
        .mockRejectedValueOnce(new BadRequestException('Email is already in use.'));

      const update: UpdateUserDto = {
        name: 'userUpdated'
      };

      try {
        await service.update('id', update);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(BadRequestException);
      }

    });
  })

  describe('findOne', () => {
    it('should return an individual user', async () => {
      const result = await controller.findOne('1c937b93-b38e-47dd-9fe8-a99b9802ed9e');
      const expected = JSON.stringify({
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
