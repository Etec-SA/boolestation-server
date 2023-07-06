import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { LevelStatesModule } from '../src/level-states/level-states.module';
import * as levelStatesJson from './fixtures/level-states';
import { CreateLevelStateDto } from 'src/level-states/dto/create-level-state.dto';
import { LevelState } from '@prisma/client';
import { UpdateLevelStateDto } from 'src/level-states/dto/update-level-state.dto';

let app: INestApplication;
let findedLevelState: LevelState;
let createdLevelState: LevelState;

describe('LevelStatesController (e2e)', () => {

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [LevelStatesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  describe('/level-states (GET)', () => {
    it('should get all level states', async () => {
      let response = await request(app.getHttpServer()).get('/level-states');

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(typeof response.body).toEqual(typeof levelStatesJson.data);
      findedLevelState = response.body[0];
    });
  });

  describe('/level-states/:id (GET)', () => {
    it('should get a single level state', async () => {
      const id = findedLevelState.id;

      let response = await request(app.getHttpServer())
        .get(`/level-states/${id}`);

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(findedLevelState);
    });

    it('should return a 404', async () => {

      let response = await request(app.getHttpServer())
        .get(`/level-states/eusimplesmentenaoexisto`);

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
    });
  });

  describe('/level-states/(POST)', () => {
    it('should create a new level state', async () => {
      let newLevelState: CreateLevelStateDto = {
        title: 'O Novo Aprendiz',
        requiredXp: 150
      }


      let response = await request(app.getHttpServer())
        .post('/level-states')
        .send(newLevelState);

      expect(response).toBeDefined();
      expect(response.status).toEqual(201);
      expect(response.body.title).toEqual(newLevelState.title);
      expect(response.body.requiredXp).toEqual(newLevelState.requiredXp);

      createdLevelState = response.body;
    });

    it('should return status code 400', async () => {
      let newLevelState = {
        title: 'I only have a title'
      }


      let response = await request(app.getHttpServer())
        .post('/level-states')
        .send(newLevelState);

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
    });
  });

  describe('/level-states/:id (PATCH)', () => {
    it('should update a level state', async () => {
      let updatedLevelState: UpdateLevelStateDto = {
        title: 'O Novo Aprendiz - Atualizado',
        requiredXp: 151
      }

      let response = await request(app.getHttpServer())
        .patch(`/level-states/${createdLevelState.id}`)
        .send(updatedLevelState);

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body.title).toEqual(updatedLevelState.title);
      expect(response.body.requiredXp).toEqual(updatedLevelState.requiredXp);

      createdLevelState = response.body;
    });

    it('should change only valid fields', async () => {
      let updatedLevelState = {
        id: 'new id',
        invalidField: true,
        requiredXp: 152
      }

      let response = await request(app.getHttpServer())
        .patch(`/level-states/${createdLevelState.id}`)
        .send(updatedLevelState);

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body.id).not.toEqual('new id');
      expect(response.body?.invalidField).toBeUndefined();
      expect(response.body.requiredXp).toEqual(152);

      createdLevelState.requiredXp = 152;
    });
  });

  describe('/level-states/:id (DELETE)', () => {
    it('/level-states/:id (DELETE)', async () => {
      let response = await request(app.getHttpServer())
        .delete(`/level-states/${createdLevelState.id}`);

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body.id).toEqual(createdLevelState.id);
      expect(response.body.requiredXp).toEqual(createdLevelState.requiredXp);
      expect(response.body.title).toEqual(createdLevelState.title);

      response = await request(app.getHttpServer())
        .get(`/level-states/${createdLevelState.id}`);

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
    });
  });
});


