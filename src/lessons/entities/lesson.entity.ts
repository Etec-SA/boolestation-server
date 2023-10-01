import { Lesson } from "@prisma/client";

export class LessonEntity implements Lesson {
  id: string;
  slug: string;
  title: string;
  content: string;
  moduleId: string;
  createdAt: Date;
  updatedAt: Date;
}
