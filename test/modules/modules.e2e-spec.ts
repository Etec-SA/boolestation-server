import { TestingModule, Test } from "@nestjs/testing";
import { ModulesModule } from "../../src/modules/modules.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { CreateModuleDto } from "../../src/modules/dto/create-module.dto";
import * as request from 'supertest';
import { Module } from "@prisma/client";
import * as modulesData from '../fixtures/modules';

let app: INestApplication;
let createdModule: Partial<Module>;
let findedModule: Module;


describe('ModulesController (e2e)', () => {
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ModulesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });


  describe('/modules/(POST)', () => {
    it('should create a new module', async () => {
      let newModule: CreateModuleDto = {
        title: 'Lógica Exemplar',
        description: 'Um exemplo de Lógica!'
      }


      let response = await request(app.getHttpServer())
        .post('/modules')
        .send(newModule);

      expect(response).toBeDefined();
      expect(response.status).toEqual(201);
      expect(response.body.title).toEqual(newModule.title);
      expect(response.body.description).toEqual(newModule.description);

      createdModule = response.body;
    });
  });

  describe('/modules (GET)', () => {
    it('should get all modules', async () => {
      let response = await request(app.getHttpServer()).get('/modules');

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(typeof response.body).toEqual(typeof modulesData);
      findedModule = response.body[0];
    });
  });

  describe('/modules/:id (GET)', () => {
    it('should get a single module', async () => {
      const id = findedModule.id;

      let response = await request(app.getHttpServer())
        .get(`/modules/${id}`);

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(findedModule);
    });

    it('should return a 404', async () => {
      let response = await request(app.getHttpServer())
        .get(`/modules/eusimplesmentenaoexisto`);

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
    });
  });

  describe('/modules/:id (PATCH)', () => {
    it('should update a module with success', async () => {
      const id = createdModule.id;

      let response = await request(app.getHttpServer())
        .patch(`/modules/${id}`)
        .send({
          title: 'Neo Logic',
          description: 'Changing',
          id: "you cant't change it.",
          invalidField: true
        });

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body.id).toEqual(createdModule.id);
      expect(response.body.title).toEqual('Neo Logic');
      expect(response.body.description).toEqual('Changing');
      expect(response.body?.invalidField).toBeUndefined();
      createdModule = response.body;
    });

    it('should return 404.', async () => {
      let response = await request(app.getHttpServer())
        .patch(`/modules/212`)
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
        .delete(`/modules/${createdModule.id}`);

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body.id).toEqual(createdModule.id);

      response = await request(app.getHttpServer())
        .get(`/modules/${createdModule.id}`);

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
    });
  });
});
