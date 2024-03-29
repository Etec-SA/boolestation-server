import { INestApplication, ValidationPipe } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { ExercisesModule } from "../../src/exercises/exercises.module";
import * as request from "supertest";
import { CreateExerciseDto } from "../../src/exercises/dto/create-exercise.dto";
import { Exercise } from "@prisma/client";
import * as data from "../fixtures/exercises.json";

let app: INestApplication;
let createdExercise: Partial<Exercise>;
let findedExercise: Exercise;

describe("ExercisesController (e2e)", () => {
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ExercisesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  describe("/exercises/(POST)", () => {
    it("should create a new exercise", async () => {
      let newExercise: CreateExerciseDto = {
        title: "Exercício exemplar!",
        description: "Um exemplo de exercício!",
        lessonId: "4151e54b-8517-4871-a1d2-acfb67a8bf1a",
      };

      let response = await request(app.getHttpServer())
        .post("/exercises")
        .send(newExercise);

      expect(response).toBeDefined();
      expect(response.status).toEqual(201);
      expect(response.body.title).toEqual(newExercise.title);
      expect(response.body.description).toEqual(newExercise.description);
      expect(response.body.lessonId).toEqual(newExercise.lessonId);

      createdExercise = response.body;
    });

    it("should return 404 when lessonId does not exist", async () => {
      let newExercise: CreateExerciseDto = {
        title: "Exercício exemplar!",
        description: "Um exemplo de exercício!",
        lessonId: "4151e54b-8517-4871-a1d2-acfb67a8bf2a",
      };

      let response = await request(app.getHttpServer())
        .post("/exercises")
        .send(newExercise);

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
    });
  });

  describe("/exercises (GET)", () => {
    it("should get all exercises", async () => {
      let response = await request(app.getHttpServer()).get("/exercises");

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(typeof response.body).toEqual(typeof data);
      findedExercise = response.body[0];
    });
  });

  describe("/exercises/:id (GET)", () => {
    it("should get a single exercise", async () => {
      const id = findedExercise.id;

      let response = await request(app.getHttpServer()).get(`/exercises/${id}`);

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(findedExercise);
    });

    it("should return a 404", async () => {
      let response = await request(app.getHttpServer()).get(
        `/exercises/eusimplesmentenaoexisto`
      );

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
    });
  });

  describe("/exercises/:id (PATCH)", () => {
    it("should update an exercise with success", async () => {
      const updatedExercise = {
        title: "New Exercise",
        description: "Now updated.",
        id: "you cant change it",
        invalidField: "you cant send it",
      };

      const response = await request(app.getHttpServer())
        .patch(`/exercises/${createdExercise.id}`)
        .send(updatedExercise);

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body.title).toEqual(updatedExercise.title);
      expect(response.body.description).toEqual(updatedExercise.description);
      expect(response.body?.invalidField).toBeUndefined();
      expect(response.body.id).not.toEqual(updatedExercise.id);
    });

    it("should return 404", async () => {
      const updatedExercise = {
        title: "New Exercise",
        description: "Now updated.",
        id: "you cant change it",
        invalidField: "you cant send it",
      };

      const response = await request(app.getHttpServer())
        .patch(`/exercises/2012`)
        .send(updatedExercise);

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
    });
  });

  describe("/exercises/:id (DELETE)", () => {
    it("should remove an exercise with success", async () => {
      let response = await request(app.getHttpServer()).delete(
        `/exercises/${createdExercise.id}`
      );

      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.body.id).toEqual(createdExercise.id);

      response = await request(app.getHttpServer()).get(
        `/exercises/${createdExercise.id}`
      );

      expect(response).toBeDefined();
      expect(response.status).toEqual(404);
    });
  });
});
