import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateLevelStateDto } from './dto/create-level-state.dto';
import { UpdateLevelStateDto } from './dto/update-level-state.dto';

@Injectable()
export class LevelStatesService {
  constructor(private prisma: PrismaService){}

  async create(data: CreateLevelStateDto) {
    const levelState = await this.prisma.levelState.create({data});
    return levelState;
  }

  async findAll() {
    return await this.prisma.levelState.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.levelState.findFirst({where:{id}})
  }

  async update(id: string, data: UpdateLevelStateDto) {
    const levelState = await this.prisma.levelState.update({
      where: {id},
      data
    });

    return levelState;
  }

  async remove(id: string) {
    return await this.prisma.levelState.delete({where: {id}});
  }
}
