import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';

const prismaMock = {
  user: {
    create: jest.fn((data: CreateUserDto) => {
      return { 
        ...data, 
        id: crypto.randomUUID(),
        xp: 0,
        isPremium: false
      };
    })
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

  describe('create', () => {
    it('should create an user with a hashed password', async () => {
      const user: CreateUserDto = {
        birthdate: new Date('1985-10-10'),
        name: 'George Bool',
        email: 'george@bool.com',
        password: '123321',
        username: 'georgebool'
      };

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
    })
  })
});
