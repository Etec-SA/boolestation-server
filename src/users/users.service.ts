import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

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

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
