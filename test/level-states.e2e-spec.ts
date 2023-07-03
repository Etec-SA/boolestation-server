import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { LevelStatesModule } from '../src/level-states/level-states.module';

describe('LevelStatesController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [LevelStatesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/level-states (GET)', () => {
    return request(app.getHttpServer())
      .get('/level-states')
      .expect(200);
  });

});

