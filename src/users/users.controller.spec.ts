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
      jest.spyOn(service, 'create').mockRejectedValue(new BadRequestException('Email is already in use.'));
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
  });
});
