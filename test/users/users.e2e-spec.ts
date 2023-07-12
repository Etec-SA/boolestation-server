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

  it('should create a new user', async () => {
    let newUser: CreateUserDto = {
      name: "Hector Vieira",
      username: "hvs",
      email: "gregorioborges@gmail.com",
      password: "sUpAgu1t4r_13",
      birthdate: new Date("2002-11-11")
    }

    let response = await request(app.getHttpServer())
      .post('/users')
      .send(newUser);
    console.log(response.body);
    expect(response).toBeDefined();
    expect(response.status).toEqual(201);
    expect(response.body?.password).toBeUndefined();
    expect(response.body.id).toBeDefined();
    createdUser = response.body;
  });


});
