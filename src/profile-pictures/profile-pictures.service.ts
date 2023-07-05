import { Injectable } from '@nestjs/common';
import { CreateProfilePictureDto } from './dto/create-profile-picture.dto';
import { UpdateProfilePictureDto } from './dto/update-profile-picture.dto';

@Injectable()
export class ProfilePicturesService {
  create(createProfilePictureDto: CreateProfilePictureDto) {
    return 'This action adds a new profilePicture';
  }

  findAll() {
    return `This action returns all profilePictures`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profilePicture`;
  }

  update(id: number, updateProfilePictureDto: UpdateProfilePictureDto) {
    return `This action updates a #${id} profilePicture`;
  }

  remove(id: number) {
    return `This action removes a #${id} profilePicture`;
  }
}
