import { Module } from "@prisma/client";

export class ModuleEntity implements Module {
  id: string;
  slug: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
}
