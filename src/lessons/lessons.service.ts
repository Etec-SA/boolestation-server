import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import slugify from "slugify";
import { ModulesService } from "../modules/modules.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class LessonsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly modulesService: ModulesService
  ) {}

  async create(data: CreateLessonDto) {
    await this.modulesService.findOne(data.moduleId);

    const slug = slugify(data.title, { lower: true });
    const lesson = await this.prisma.lesson.create({ data: { ...data, slug } });
    return lesson;
  }

  async findAll(moduleId: string) {
    const include = Prisma.validator<Prisma.LessonInclude>()({
      exercises: {
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          alternatives: {
            select: { id: true, isCorrect: true, content: true },
          },
        },
      },
    });

    const orderBy = Prisma.validator<Prisma.LessonOrderByWithRelationInput>()({
      createdAt: "asc",
    });

    const query = { include, orderBy };

    if (!moduleId) return this.prisma.lesson.findMany({ ...query });

    const lessons = await this.prisma.lesson.findMany({
      where: { moduleId },
      ...query,
    });

    if (lessons.length === 0) throw new NotFoundException("Lessons not found.");

    return lessons;
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id },
      include: {
        exercises: {
          select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
            alternatives: {
              select: { id: true, isCorrect: true, content: true },
            },
          },
        },
      },
    });
    if (!lesson) throw new NotFoundException("Lesson not found.");
    return lesson;
  }

  async update(id: string, data: UpdateLessonDto) {
    await this.findOne(id);

    if (data?.title) data["slug"] = slugify(data.title, { lower: true });

    const lesson = await this.prisma.lesson.update({
      where: { id },
      data,
    });

    return lesson;
  }

  remove(id: string) {
    return this.prisma.lesson.delete({ where: { id } });
  }
}
