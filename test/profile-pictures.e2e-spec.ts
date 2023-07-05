import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ProfilePicturesModule } from 'src/profile-pictures/profile-pictures.module';
import { ProfilePicture } from '@prisma/client';

let findedProfilePicture: ProfilePicture;
let createdProfilePicture: ProfilePicture;
let app: INestApplication;

describe('AppController (e2e)', () => {
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProfilePicturesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });
});
