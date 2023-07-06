import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ProfilePicturesModule } from '../src/profile-pictures/profile-pictures.module';
import { ProfilePicture } from '@prisma/client';
import * as profilePicturesJson from './fixtures/profile-pictures';

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

  describe('/profile-pictures (GET)', () => {
    it('should get all profile pictures', async () => {
      let response = await request(app.getHttpServer()).get('/profile-pictures');

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(typeof response.body).toEqual(typeof profilePicturesJson.data);
      findedProfilePicture = response.body[0];
    });
  });

  describe('/profile-pictures/:id (GET)', () => {
    it('should get a single profile picture', async () => {
      const id = findedProfilePicture.id;

      let response = await request(app.getHttpServer())
        .get(`/profile-pictures/${id}`);

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(findedProfilePicture);
    });

    it('should return a 404', async () => {

      let response = await request(app.getHttpServer())
        .get(`/profile-pictures/eusimplesmentenaoexisto`);

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
    });
  });
});
