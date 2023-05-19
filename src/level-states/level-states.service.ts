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

  update(id: number, updateLevelStateDto: UpdateLevelStateDto) {
    return `This action updates a #${id} levelState`;
  }

  remove(id: number) {
    return `This action removes a #${id} levelState`;
  }
}
