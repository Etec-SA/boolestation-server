import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRequest } from './entities/auth-request.entity';
import { User } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

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
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({
              access_token: 'token'
            }),
          }
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return the access token', async () => {
      const request = {
        user
      } as AuthRequest;

      const result = await controller.login(request);
      expect(result).toBeDefined();
      expect(result.access_token).toEqual('token');
    });
  });
});
