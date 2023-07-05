import { Module } from '@nestjs/common';
import { ProfilePicturesService } from './profile-pictures.service';
import { ProfilePicturesController } from './profile-pictures.controller';

@Module({
  controllers: [ProfilePicturesController],
  providers: [ProfilePicturesService]
})
export class ProfilePicturesModule {}
