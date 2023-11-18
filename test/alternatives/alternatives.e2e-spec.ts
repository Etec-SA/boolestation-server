import { INestApplication, ValidationPipe } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import * as request from "supertest";
import { Alternative } from "@prisma/client";
import { AlternativesModule } from "../../src/alternatives/alternatives.module";
import { CreateAlternativeDto } from "../../src/alternatives/dto/create-alternative.dto";
import { data } from "../fixtures/alternatives";

let app: INestApplication;
let createdAlternative: Partial<Alternative>;
let findedAlternative: Alternative;

describe("AlternativesController (e2e)", () => {
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AlternativesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  describe("/alternatives (POST)", () => {
    it("should create a new alternative", async () => {
      let newAlternative: CreateAlternativeDto = {
        content: "Esta é uma alternativa.",
        exerciseId: "af0f6b40-d98d-4a77-a1a1-3fdfff114511",
        isCorrect: false,
      };

      let response = await request(app.getHttpServer())
        .post("/alternatives")
        .send(newAlternative);

      expect(response).toBeDefined();
      expect(response.status).toEqual(201);
      expect(response.body.content).toEqual(newAlternative.content);
      expect(response.body.exerciseId).toEqual(newAlternative.exerciseId);
      expect(response.body.isCorrect).toEqual(newAlternative.isCorrect);

      createdAlternative = response.body;
    });

    it("should return 404 when exerciseId does not exist", async () => {
      let newAlternative: CreateAlternativeDto = {
        content: "Esta é uma alternativa.",
        isCorrect: false,
        exerciseId: "4151e54b-8517-4871-a1d2-acfb67a8bf2a",
      };

      let response = await request(app.getHttpServer())
        .post("/alternatives")
        .send(newAlternative);

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
    });
  });

  describe("/alternatives (GET)", () => {
    it("should get all alternatives", async () => {
      let response = await request(app.getHttpServer()).get("/alternatives");

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(typeof response.body).toEqual(typeof data);
      findedAlternative = response.body[0];
    });
  });

  describe("/alternatives/:id (GET)", () => {
    it("should get a single alternative", async () => {
      const id = findedAlternative.id;

      let response = await request(app.getHttpServer()).get(
        `/alternatives/${id}`
      );

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(findedAlternative);
    });

    it("should return a 404", async () => {
      let response = await request(app.getHttpServer()).get(
        `/exercises/eusimplesmentenaoexisto`
      );

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
    });
  });

  describe("/alternatives/:id (DELETE)", () => {
    it("should remove an alternative with success", async () => {
      let response = await request(app.getHttpServer()).delete(
        `/alternatives/${createdAlternative.id}`
      );

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body.id).toEqual(createdAlternative.id);

      response = await request(app.getHttpServer()).get(
        `/alternatives/${createdAlternative.id}`
      );

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
    });
  });
});
