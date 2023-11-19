import { Injectable, NotFoundException } from "@nestjs/common";
import { LessonsService } from "../lessons/lessons.service";
import { PrismaService } from "../database/prisma.service";
import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { UpdateExerciseDto } from "./dto/update-exercise.dto";

@Injectable()
export class ExercisesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lessonsService: LessonsService
  ) {}

  async create(data: CreateExerciseDto) {
    await this.lessonsService.findOne(data.lessonId);
    const exercise = await this.prisma.exercise.create({ data });
    return exercise;
  }

  findAll() {
    return this.prisma.exercise.findMany({
      include: {
        alternatives: {
          select: {
            id: true,
            content: true,
            isCorrect: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const exercise = await this.prisma.exercise.findFirst({
      where: { id },
      include: {
        alternatives: {
          select: {
            id: true,
            content: true,
            isCorrect: true,
          },
        },
      },
    });
    if (!exercise) throw new NotFoundException("Exercise not found.");
    return exercise;
  }

  async update(id: string, data: UpdateExerciseDto) {
    await this.findOne(id);
    if (data?.lessonId) await this.lessonsService.findOne(data.lessonId);
    const exercise = await this.prisma.exercise.update({ where: { id }, data });
    return exercise;
  }

  remove(id: string) {
    return this.prisma.exercise.delete({ where: { id } });
  }
}
