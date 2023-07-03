import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { LevelStatesModule } from '../src/level-states/level-states.module';
import * as levelStatesJson from './fixtures/level-states';
import { CreateLevelStateDto } from 'src/level-states/dto/create-level-state.dto';
import { LevelState } from '@prisma/client';
import { UpdateLevelStateDto } from 'src/level-states/dto/update-level-state.dto';

describe('LevelStatesController (e2e)', () => {
  let app: INestApplication;
  let findedLevelState: LevelState;
  let createdLevelState: LevelState;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [LevelStatesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/level-states (GET)', async () => {
    let response = await request(app.getHttpServer()).get('/level-states');

    expect(response).toBeDefined();
    expect(response.status).toEqual(200);
    expect(typeof response.body).toEqual(typeof levelStatesJson.data);
    findedLevelState = response.body[0];
  });

  it('/level-states/:id (GET)', async () => {
    const id = findedLevelState.id;

    let response = await request(app.getHttpServer())
      .get(`/level-states/${id}`);

    expect(response).toBeDefined();
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(findedLevelState);
  });

  it('/level-states (POST)', async () => {
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

  it('/level-states (PATCH)', async () => {
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

  it('/level-states/:id (DELETE)', async () => {
    let response = await request(app.getHttpServer())
      .delete(`/level-states/${createdLevelState.id}`);

    expect(response).toBeDefined();
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(createdLevelState);

    response = await request(app.getHttpServer())
      .get(`/level-states/${createdLevelState.id}`);

    expect(response).toBeDefined();
    expect(response.status).toEqual(404);
  });

});

