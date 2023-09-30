import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import slugify from 'slugify';
import { ModulesService } from '../modules/modules.service';

@Injectable()
export class LessonsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly modulesService: ModulesService
  ) { }

  async create(data: CreateLessonDto) {
    await this.modulesService.findOne(data.moduleId);

    const slug = slugify(data.title, { lower: true });
    const lesson = await this.prisma.lesson.create({ data: { ...data, slug } });
    return lesson;
  }

  findAll() {
    return this.prisma.lesson.findMany();
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findFirst({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found.');
    return lesson;
  }

  async update(id: string, data: UpdateLessonDto) {
    await this.findOne(id);

    if (data?.title) data['slug'] = slugify(data.title, { lower: true });

    const lesson = await this.prisma.lesson.update({
      where: { id },
      data
    });

    return lesson;
  }

  remove(id: string) {
    return this.prisma.lesson.delete({ where: { id } });
  }
}
