import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { LevelStatesService } from "../level-states/level-states.service";
import { ProfilePicturesService } from "../profile-pictures/profile-pictures.service";

import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
dayjs.extend(utc);

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private levelStatesService: LevelStatesService,
    private profilePicturesService: ProfilePicturesService
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.verifyUniqueProperty(
      createUserDto.email,
      createUserDto.username,
      {
        throwIfExists: true,
      }
    );

    const levelStateId = await this.levelStatesService.findLowestLevelStateId();

    const profilePictureId =
      await this.profilePicturesService.findFirstProfilePictureId();

    const user: Prisma.UserCreateInput = {
      ...createUserDto,
      birthdate: dayjs(createUserDto.birthdate).utc().format(),
      password: await bcrypt.hash(createUserDto.password, 10),
      levelState: {
        connect: levelStateId,
      },
      profilePicture: {
        connect: profilePictureId,
      },
    };

    const result = await this.prisma.user.create({ data: user });

    return {
      ...result,
      password: undefined,
    };
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException("User Not Found");

    return user;
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: { email },
    });
  }

  async update(id: string, data: UpdateUserDto) {
    await this.findOne(id);
    await this.verifyUniqueProperty(data?.email, data?.username, {
      throwIfExists: true,
    });

    const result = await this.prisma.user.update({ data, where: { id } });

    return {
      ...result,
      password: undefined,
    };
  }

  async remove(id: string) {
    let response = await this.prisma.user.delete({ where: { id } });
    return {
      ...response,
      password: undefined,
    };
  }

  async verifyUniqueProperty(
    email?: string,
    username?: string,
    settings?: { throwIfExists?: boolean }
  ) {
    if (!email && !username) return;

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
      select: {
        email: true,
        username: true,
      },
    });

    if (!user) return;

    if (!settings.throwIfExists) return user;

    let message = user?.email == email ? "Email" : "Username";
    throw new BadRequestException(`${message} is already in use.`);
  }
}
