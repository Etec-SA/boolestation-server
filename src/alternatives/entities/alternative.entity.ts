import { Alternative } from "@prisma/client";

export class AlternativeEntity implements Alternative {
  id: string;
  exerciseId: string;
  content: string;
  isCorrect: boolean;
  createdAt: Date;
  updatedAt: Date;
}
