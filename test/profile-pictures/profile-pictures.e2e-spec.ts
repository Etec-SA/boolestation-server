import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ProfilePicturesModule } from '../../src/profile-pictures/profile-pictures.module';
import { ProfilePicture } from '@prisma/client';
import * as profilePicturesJson from '../fixtures/profile-pictures';
import { CreateProfilePictureDto } from 'src/profile-pictures/dto/create-profile-picture.dto';
import { UpdateProfilePictureDto } from 'src/profile-pictures/dto/update-profile-picture.dto';

let findedProfilePicture: ProfilePicture;
let createdProfilePicture: ProfilePicture;
let app: INestApplication;

describe('AppController (e2e)', () => {
  beforeAll(async () => {
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

  describe('/profile-pictures/ (POST)', () => {
    it('should create a new profile picture', async () => {
      let newProfilePicture: CreateProfilePictureDto = {
        title: 'Kant',
        url: 'http://kant.pru/image.png'
      }


      let response = await request(app.getHttpServer())
        .post('/profile-pictures')
        .send(newProfilePicture);

      expect(response).toBeDefined();
      expect(response.status).toEqual(201);
      expect(response.body.title).toEqual(newProfilePicture.title);
      expect(response.body.url).toEqual(newProfilePicture.url);

      createdProfilePicture = response.body;
    });

    it('should return status code 400', async () => {
      let newProfilePicture = {
        title: 'I only have a title'
      }


      let response = await request(app.getHttpServer())
        .post('/profile-pictures')
        .send(newProfilePicture);

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
    });
  });

  describe('/profile-pictures/:id (PATCH)', () => {
    it('should update a profile picture', async () => {
      let updatedProfilePicture: UpdateProfilePictureDto = {
        title: 'foo',
        url: 'bar'
      }

      let response = await request(app.getHttpServer())
        .patch(`/profile-pictures/${createdProfilePicture.id}`)
        .send(updatedProfilePicture);

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body.title).toEqual(updatedProfilePicture.title);
      expect(response.body.url).toEqual(updatedProfilePicture.url);

      createdProfilePicture = response.body;
    });

    it('should change only valid fields', async () => {
      let updatedProfilePicture = {
        id: 'new id',
        invalidField: true,
        url: 'baaar'
      }

      let response = await request(app.getHttpServer())
        .patch(`/profile-pictures/${createdProfilePicture.id}`)
        .send(updatedProfilePicture);

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body.id).not.toEqual('new id');
      expect(response.body?.invalidField).toBeUndefined();
      expect(response.body.url).toEqual('baaar');

      createdProfilePicture.url = 'baaar';
    });
  });

  describe('/profile-pictures/:id (DELETE)', () => {
    it('/profile-pictures/:id (DELETE)', async () => {
      let response = await request(app.getHttpServer())
        .delete(`/profile-pictures/${createdProfilePicture.id}`);

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body.id).toEqual(createdProfilePicture.id);
      expect(response.body.title).toEqual(createdProfilePicture.title);
      expect(response.body.url).toEqual(createdProfilePicture.url);

      response = await request(app.getHttpServer())
        .get(`/profile-pictures/${createdProfilePicture.id}`);

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
    });
  });
});
