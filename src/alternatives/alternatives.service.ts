import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAlternativeDto } from "./dto/create-alternative.dto";
import { UpdateAlternativeDto } from "./dto/update-alternative.dto";
import { PrismaService } from "../database/prisma.service";
import { ExercisesService } from "../exercises/exercises.service";

@Injectable()
export class AlternativesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly exercisesService: ExercisesService
  ) {}

  async create(data: CreateAlternativeDto) {
    const exercise = await this.exercisesService.findOne(data.exerciseId);
    if (!exercise) throw new NotFoundException("Exercise Not Found");

    const alternative = await this.prisma.alternative.create({ data });
    return alternative;
  }

  findAll() {
    return this.prisma.alternative.findMany();
  }

  async findOne(id: string) {
    const alternative = await this.prisma.alternative.findUnique({
      where: { id },
    });

    if (!alternative) throw new NotFoundException("Alternative Not Found.");

    return alternative;
  }

  async update(id: string, data: UpdateAlternativeDto) {
    const exercise = await this.exercisesService.findOne(data.exerciseId);
    if (!exercise) throw new NotFoundException("Exercise Not Found");

    return this.prisma.alternative.update({ where: { id }, data });
  }

  async remove(id: string) {
    const alternative = await this.prisma.alternative.findUnique({
      where: { id },
    });

    if (!alternative) throw new NotFoundException("Alternative Not Found");

    return this.prisma.alternative.delete({ where: { id } });
  }
}
