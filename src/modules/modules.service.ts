import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateModuleDto } from "./dto/create-module.dto";
import { UpdateModuleDto } from "./dto/update-module.dto";
import { PrismaService } from "../database/prisma.service";
import slugify from "slugify";

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateModuleDto) {
    const slug = slugify(data.title, { lower: true });

    const module = await this.prisma.module.create({ data: { ...data, slug } });
    return module;
  }

  findAll() {
    return this.prisma.module.findMany({
      include: {
        lessons: {
          select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const module = await this.prisma.module.findFirst({
      where: { id },
      include: {
        lessons: {
          select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });

    if (!module) throw new NotFoundException("Module not found.");

    return module;
  }

  async update(id: string, data: UpdateModuleDto) {
    await this.findOne(id);

    if (data?.title) data["slug"] = slugify(data.title);

    const module = await this.prisma.module.update({
      where: { id },
      data,
    });

    return module;
  }

  remove(id: string) {
    return this.prisma.module.delete({ where: { id } });
  }
}
