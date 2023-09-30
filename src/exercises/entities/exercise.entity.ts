import { Exercise } from "@prisma/client";

export class ExerciseEntity implements Exercise {
  id: string;
  title: string;
  description: string;
  lessonId: string;
  createdAt: Date;
  updatedAt: Date;
}
