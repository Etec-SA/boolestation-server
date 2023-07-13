import { User } from "@prisma/client";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { UsersModule } from "../../src/users/users.module";
import { CreateUserDto } from "../../src/users/dto/create-user.dto";
import * as request from 'supertest';

let createdUser: Partial<User>;

let app: INestApplication;

describe('Users (e2e)', () => {
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  describe('/users (POST)', () => {
    it('should create a new user', async () => {
      let newUser: CreateUserDto = {
        name: "Hector Vieira Saldivar",
        username: "hectorguitar032",
        email: "hvs@gmail.com",
        password: "sUpAgu1t4r_13",
        birthdate: new Date("2002-11-11")
      }

      let response = await request(app.getHttpServer())
        .post('/users')
        .send(newUser);

      expect(response).toBeDefined();
      expect(response.status).toEqual(201);
      expect(response.body?.password).toBeUndefined();
      expect(response.body.id).toBeDefined();
      createdUser = response.body;
    });

    it('should rejects the creation if email is already in use', async () => {
      let newUser: CreateUserDto = {
        name: "Hector Vieira Saldivar Júnior",
        username: "juninho13",
        email: createdUser.email,
        password: "supaguitar12122",
        birthdate: new Date("2013-11-11")
      }

      let response = await request(app.getHttpServer())
        .post('/users')
        .send(newUser);

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual('Bad Request');
      expect(response.body.message).toEqual('Email is already in use.');
    });

    it('should rejects the creation if username is already in use', async () => {
      let newUser: CreateUserDto = {
        name: "Hector Vieira Saldivar Júnior",
        username: createdUser.username,
        email: "hvs@booleano.com",
        password: "supaguitar12122",
        birthdate: new Date("2013-11-11")
      }

      let response = await request(app.getHttpServer())
        .post('/users')
        .send(newUser);

      expect(response).toBeDefined();
      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual('Bad Request');
      expect(response.body.message).toEqual('Username is already in use.');
    });

  });

  describe('/users/:id (DELETE)', ()=>{
    it('should remove an user with success', async () => {
      let response = await request(app.getHttpServer())
        .delete(`/users/${createdUser.id}`);

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body.id).toEqual(createdUser.id);
      expect(response.body?.password).toBeUndefined();

      response = await request(app.getHttpServer())
        .get(`/users/${createdUser.id}`);

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
    });
  });
});
