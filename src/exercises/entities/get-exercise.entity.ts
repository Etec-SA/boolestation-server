import { Exercise } from "@prisma/client";

export class Alternative {
  id: string;
  content: string;
  isCorrect: boolean;
}

export class GetExerciseEntity implements Exercise {
  id: string;
  title: string;
  description: string;
  lessonId: string;
  createdAt: Date;
  updatedAt: Date;
  alternatives: Alternative[];
}
