import { Lesson } from "@prisma/client";
import { Alternative } from "../../exercises/entities/get-exercise.entity";

export class Exercise {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  alternatives: Alternative[];
}

export class GetLessonEntity implements Lesson {
  id: string;
  slug: string;
  title: string;
  content: string;
  moduleId: string;
  createdAt: Date;
  updatedAt: Date;
  exercises: Exercise[];
}
