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

  findAll() {
    return `This action returns all levelStates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} levelState`;
  }

  update(id: number, updateLevelStateDto: UpdateLevelStateDto) {
    return `This action updates a #${id} levelState`;
  }

  remove(id: number) {
    return `This action removes a #${id} levelState`;
  }
}
