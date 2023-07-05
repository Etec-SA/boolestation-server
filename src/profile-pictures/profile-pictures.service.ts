import { Injectable } from '@nestjs/common';
import { CreateProfilePictureDto } from './dto/create-profile-picture.dto';
import { UpdateProfilePictureDto } from './dto/update-profile-picture.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProfilePicturesService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateProfilePictureDto) {
    const profilePicture = await this.prisma.profilePicture.create({ data });

    return profilePicture;
  }

  async findAll() {
    return await this.prisma.profilePicture.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.profilePicture.findFirst({
      where: {
        id
      }
    });
  }

  async update(id: string, data: UpdateProfilePictureDto) {
    const profilePicture = await this.prisma.profilePicture.update({
      where: { id },
      data
    });

    return profilePicture;
  }

  async remove(id: string) {
    return await this.prisma.profilePicture.delete({ where: { id } });
  }
}
