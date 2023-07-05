import { Module } from '@nestjs/common';
import { ProfilePicturesService } from './profile-pictures.service';
import { ProfilePicturesController } from './profile-pictures.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [ProfilePicturesController],
  providers: [ProfilePicturesService, PrismaService]
})
export class ProfilePicturesModule { }
