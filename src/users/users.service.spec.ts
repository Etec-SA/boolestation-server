import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { LevelStatesService } from '../level-states/level-states.service';

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
    delete: jest.fn(),
    update: jest.fn(()=>{
      return {
        name: 'userUpdated',
        username: 'user',
        email: 'user@email.com',
        password: 'user',
        birthdate: new Date('')
      }
    })
  },
  profilePicture: {
    findFirst: jest.fn().mockResolvedValue(crypto.randomUUID())
  },
}

const levelStateServiceMock = {
  findLowestLevelStateId: jest.fn().mockResolvedValue(crypto.randomUUID()),
}

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: LevelStatesService, useValue: levelStateServiceMock }
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

  describe('update', ()=>{
    it('should update an user with success', async ()=>{
      jest.spyOn(service, 'verifyUniqueProperty').mockResolvedValueOnce(undefined);
      const update: UpdateUserDto = {
        name: 'userUpdated'
      };

      const response = await service.update('id', update);
      expect(response).toBeDefined();
      expect(response?.password).toBeUndefined();
    });

    it('should throw an exception if email or username is already in use', async ()=>{
      jest.spyOn(service, 'verifyUniqueProperty').mockRejectedValueOnce(new BadRequestException());
      const update: UpdateUserDto = {
        name: 'userUpdated'
      };

      try{
        await service.update('id', update);
      }catch(e){
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(BadRequestException);
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
      expect(prisma.user.findFirst).toHaveBeenCalledTimes(6);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { id: '1c937b93-b38e-47dd-9fe8-a99b9802ed9e' },
      });
    });

    it(`should return an exception when user is not found`, async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValueOnce(undefined);
      
      try {
        await service.findOne('1c111b93-b38e-47dd-9fe8-a99b9802ed9e');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(prisma.user.findFirst).toHaveBeenCalledTimes(7);
        expect(prisma.user.findFirst).toHaveBeenCalledWith({
          where: { id: '1c111b93-b38e-47dd-9fe8-a99b9802ed9e' },
        });
      }
      
    });
  });

  describe('findByEmail', ()=>{
    it('should return a single user', async () => {
      const response = await service.findByEmail('user@email.com');
      const expected = JSON.stringify({
        name: 'user',
        username: 'user',
        email: 'user@email.com',
        password: 'user',
        birthdate: new Date('0000-00-00')
      });

      expect(JSON.stringify(response)).toEqual(expected);
      expect(prisma.user.findFirst).toHaveBeenCalledTimes(8);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'user@email.com' },
      });
    });

    it('should throw an error', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockRejectedValueOnce(new Error());
      await expect(service.findByEmail('user@email.com')).rejects.toThrowError();
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

  describe('verifyUniqueProperty', ()=>{
    it('should return nothing if both property params are null', async ()=>{
      const result = await service.verifyUniqueProperty();
      expect(result).toBeUndefined();
    });

    it('should return nothing if dont find nothing', async ()=>{
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValueOnce(undefined);
      const result = await service.verifyUniqueProperty('email', 'username');
      expect(result).toBeUndefined();
    });

    it('should return an user if email match', async ()=>{
      const result = await service.verifyUniqueProperty('user@email.com', 'user2', {
        throwIfExists: false
      });

      expect(result).toBeDefined();
      expect(result.email).toEqual('user@email.com');
    });

    it('should return an user if username match', async ()=>{
      const result = await service.verifyUniqueProperty('user@emaisl.com', 'user', {
        throwIfExists: false
      });

      expect(result).toBeDefined();
      expect(result.username).toEqual('user');
    });

    it('should throw an exception if email match', async ()=>{
      try{
        await service.verifyUniqueProperty('user@email.com', 'usero', {
          throwIfExists: true
        });
      }catch(e){
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toEqual('Email is already in use.');
      }
    });

    it('should throw an exception if username match', async ()=>{
      try{
        await service.verifyUniqueProperty('userss@email.com', 'user', {
          throwIfExists: true
        });
      }catch(e){
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toEqual('Username is already in use.');
      }
    });
  });
});
