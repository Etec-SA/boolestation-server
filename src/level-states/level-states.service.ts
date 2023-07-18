import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateLevelStateDto } from './dto/create-level-state.dto';
import { UpdateLevelStateDto } from './dto/update-level-state.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class LevelStatesService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateLevelStateDto) {
    const levelState = await this.prisma.levelState.create({ data });
    return levelState;
  }

  async findAll() {
    return await this.prisma.levelState.findMany();
  }

  async findOne(id: string) {
    const levelState = await this.prisma.levelState.findFirst({ where: { id } })
    if (!levelState) throw new NotFoundException('Level State not found!');
    return levelState;
  }

  async findLowestLevelStateId(){
    const levelStateId = await this.prisma.levelState.findFirst({
      select: {
        id: true
      },
      orderBy: {
        requiredXp: 'asc'
      }
    });

    if (!levelStateId) throw new NotFoundException('Level State not found!');
    return levelStateId;
  }

  async update(id: string, data: UpdateLevelStateDto) {
    const levelState = await this.prisma.levelState.update({
      where: { id },
      data
    });

    return levelState;
  }

  async remove(id: string) {
    return await this.prisma.levelState.delete({ where: { id } });
  }
}
