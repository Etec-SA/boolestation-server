import { Injectable } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { PrismaService } from '../database/prisma.service';
import slugify from 'slugify';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateModuleDto) {
    const slug = slugify(data.title, { lower: true });

    const module = await this.prisma.module.create({ data: { ...data, slug } });
    return module;
  }

  findAll() {
    return `This action returns all modules`;
  }

  findOne(id: number) {
    return `This action returns a #${id} module`;
  }

  update(id: number, updateModuleDto: UpdateModuleDto) {
    return `This action updates a #${id} module`;
  }

  remove(id: number) {
    return `This action removes a #${id} module`;
  }
}
