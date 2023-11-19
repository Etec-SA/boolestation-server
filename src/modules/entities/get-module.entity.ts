import { Module } from "@prisma/client";

export class Lesson {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: Date;
}

export class GetModuleEntity implements Module {
  id: string;
  slug: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  lessons: Lesson[];
}
