import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfilePicturesService } from './profile-pictures.service';
import { CreateProfilePictureDto } from './dto/create-profile-picture.dto';
import { UpdateProfilePictureDto } from './dto/update-profile-picture.dto';

@Controller('profile-pictures')
export class ProfilePicturesController {
  constructor(private readonly profilePicturesService: ProfilePicturesService) { }

  @Post()
  create(@Body() createProfilePictureDto: CreateProfilePictureDto) {
    return this.profilePicturesService.create(createProfilePictureDto);
  }

  @Get()
  findAll() {
    return this.profilePicturesService.findAll();
  }
  /*
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.profilePicturesService.findOne(+id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProfilePictureDto: UpdateProfilePictureDto) {
      return this.profilePicturesService.update(+id, updateProfilePictureDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.profilePicturesService.remove(+id);
    }*/
}
