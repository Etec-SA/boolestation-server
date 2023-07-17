import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;
  const user: User = {
    id: '4151e54b-8517-4871-a1d2-acfb67a8bf1a',
    name: 'Aristotle',
    username: 'aristotle',
    email: 'aristotle@athenas.com',
    birthdate: new Date('1999-11-11'),
    levelStateId: '4151e54b-8517-4871-a1d2-acfb67a8bf1a',
    profilePictureId: '4151e54b-8517-4871-a1d2-acfb67a8bf1a',
    password: 'zonpoNWDNIEONAwqplaźwdqwd-20@(13142',
    xp: 0,
    isAdmin: true,
    isPremium: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }



  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(() => {
              return user;
            })
          }
        },
        {
          provide: JwtService,
          useValue: {

          }
        }
      ],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user', async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    const result = await service.validateUser('aristotle@athenas.com', 'zonpoNWDNIEONAwqplaźwdqwd-20@(13142');
    expect(result).toBeDefined();
    expect(result?.password).toBeUndefined();
    expect(result).toEqual({
      ...user,
      password: undefined
    });
  });
});
