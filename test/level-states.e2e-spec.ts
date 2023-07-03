import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { LevelStatesModule } from '../src/level-states/level-states.module';
import * as levelStatesJson from './fixtures/level-states';

describe('LevelStatesController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [LevelStatesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/level-states (GET)', async () => {
    let response = await request(app.getHttpServer()).get('/level-states');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(levelStatesJson.data);
  });

});

