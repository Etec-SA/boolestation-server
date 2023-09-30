import { Injectable, NotFoundException } from '@nestjs/common';
import { LessonsService } from 'src/lessons/lessons.service';
import { PrismaService } from '../database/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lessonsService: LessonsService
  ) { }

  async create(data: CreateExerciseDto) {
    await this.lessonsService.findOne(data.lessonId);
  }

  findAll() {
    return `This action returns all exercises`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exercise`;
  }

  update(id: number, updateExerciseDto: UpdateExerciseDto) {
    return `This action updates a #${id} exercise`;
  }

  remove(id: number) {
    return `This action removes a #${id} exercise`;
  }
}
