import { TestingModule, Test } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from 'supertest';
import { Lesson } from "@prisma/client";
import { LessonsModule } from "../../src/lessons/lessons.module";
import { CreateLessonDto } from "../../src/lessons/dto/create-lesson.dto";

let app: INestApplication;
let createdLesson: Partial<Lesson>;
let findedLesson: Lesson;


describe('LessonsController (e2e)', () => {
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [LessonsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });


  describe('/lessons/(POST)', () => {
    it('should create a new lesson', async () => {
      let newLesson: CreateLessonDto = {
        title: 'Lição Exemplar',
        moduleId: 'af0f6b40-d98d-4a77-a1a1-3fdfff114511',
        content: 'Essa é uma lição exemplar'
      }


      let response = await request(app.getHttpServer())
        .post('/lessons')
        .send(newLesson);

      expect(response).toBeDefined();
      expect(response.status).toEqual(201);
      expect(response.body.title).toEqual(newLesson.title);
      expect(response.body.content).toEqual(newLesson.content);
      expect(response.body.moduleId).toEqual(newLesson.moduleId);

      createdLesson = response.body;
    });

    it('should return 404 when moduleId does not exist', async () => {
      let newLesson: CreateLessonDto = {
        title: 'Lição Exemplar',
        moduleId: 'af0f6b40-d98d-4a77-a1a1-3fdfff114512',
        content: 'Essa é uma lição exemplar'
      }


      let response = await request(app.getHttpServer())
        .post('/lessons')
        .send(newLesson);

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
    });
  });

  describe('/lessons (GET)', () => {
    it('should get all lessons', async () => {
      let response = await request(app.getHttpServer()).get('/lessons');

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(typeof response.body).toEqual(typeof response.body);
      findedLesson = response.body[0];
    });
  });

  describe('/lessons/:id (GET)', () => {
    it('should get a single lesson', async () => {
      const id = findedLesson.id;

      let response = await request(app.getHttpServer())
        .get(`/lessons/${id}`);

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(findedLesson);
    });

    it('should return a 404', async () => {
      let response = await request(app.getHttpServer())
        .get(`/lessons/eusimplesmentenaoexisto`);

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
    });
  });

  describe('/lessons/:id (PATCH)', () => {
    it('should update a lesson with success', async () => {
      const id = createdLesson.id;

      let response = await request(app.getHttpServer())
        .patch(`/lessons/${id}`)
        .send({
          title: 'Neo Lesson',
          content: 'Is a new lesson',
          id: "you cant't change it.",
          invalidField: true
        });

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body.id).toEqual(createdLesson.id);
      expect(response.body.title).toEqual('Neo Lesson');
      expect(response.body.content).toEqual('Is a new lesson');
      expect(response.body?.invalidField).toBeUndefined();
      createdLesson = response.body;
    });

    it('should return 404.', async () => {
      let response = await request(app.getHttpServer())
        .patch(`/lessons/212`)
        .send({
          title: 'something',
        });

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
    });
  });

  describe('/modules/:id (DELETE)', () => {
    it('should remove a module with success', async () => {
      let response = await request(app.getHttpServer())
        .delete(`/lessons/${createdLesson.id}`);

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body.id).toEqual(createdLesson.id);

      response = await request(app.getHttpServer())
        .get(`/lessons/${createdLesson.id}`);

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
    });
  });
});

