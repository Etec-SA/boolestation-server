import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import slugify from "slugify";
import { ModulesService } from "../modules/modules.service";
import { Prisma } from "@prisma/client";
import { LessonsCacheService } from "./cache/lessons-cache.service";

@Injectable()
export class LessonsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly modulesService: ModulesService,
    private readonly cache: LessonsCacheService
  ) {}

  async create(data: CreateLessonDto) {
    await this.modulesService.findOne(data.moduleId);

    const slug = slugify(data.title, { lower: true });
    const lesson = await this.prisma.lesson.create({ data: { ...data, slug } });
    this.cache.clear();
    return lesson;
  }

  async findAll(moduleId: string) {
    const query = {};

    const cachedLessons = await this.cache.findAll();

    if (cachedLessons && !moduleId) return cachedLessons;

    query["include"] = Prisma.validator<Prisma.LessonInclude>()({
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

    query["orderBy"] =
      Prisma.validator<Prisma.LessonOrderByWithRelationInput>()({
        createdAt: "asc",
      });

    query["where"] = moduleId ? { id: moduleId } : undefined;

    const lessons = await this.prisma.lesson.findMany({ ...query });

    if (!query["where"]) this.cache.setLessons(lessons);

    if (lessons.length === 0 || !lessons)
      throw new NotFoundException("Lessons not found.");

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
    this.cache.clear();
    return lesson;
  }

  async remove(id: string) {
    const deleted = this.prisma.lesson.delete({ where: { id } });
    this.cache.clear();
    return deleted;
  }
}
