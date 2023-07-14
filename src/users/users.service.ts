import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }
  async create(createUserDto: CreateUserDto) {

    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserDto.email },
          { username: createUserDto.username }
        ]
      },
      select: {
        email: true,
        username: true
      }
    });

    if (userExists) {
      let message = userExists.email == createUserDto.email ? 'Email' : 'Username';
      throw new BadRequestException(`${message} is already in use.`);
    }

    const levelStateId = await this.prisma.levelState.findFirst({
      select: {
        id: true
      },
      orderBy: {
        requiredXp: 'asc'
      }
    });

    const profilePictureId = await this.prisma.profilePicture.findFirst({
      select: { id: true },
      orderBy: {
        createdAt: 'asc'
      }
    });

    const user: Prisma.UserCreateInput = {
      ...createUserDto,
      birthdate: dayjs(createUserDto.birthdate).utc().format(),
      password: await bcrypt.hash(createUserDto.password, 10),
      levelState: {
        connect: levelStateId
      },
      profilePicture: {
        connect: profilePictureId
      }
    };

    const result = await this.prisma.user.create({ data: user });

    return {
      ...result,
      password: undefined
    }
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id
      }
    });
    
    if (!user) throw new NotFoundException('User Not Found');

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    let response = await this.prisma.user.delete({ where: { id } });
    return {
      ...response,
      password: undefined
    }
  }
}
