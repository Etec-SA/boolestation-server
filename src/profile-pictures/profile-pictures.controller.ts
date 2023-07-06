import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfilePicturesService } from './profile-pictures.service';
import { CreateProfilePictureDto } from './dto/create-profile-picture.dto';
import { UpdateProfilePictureDto } from './dto/update-profile-picture.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProfilePictureEntity } from './entities/profile-picture.entity';

@ApiTags('profile-pictures')
@Controller('profile-pictures')
export class ProfilePicturesController {
  constructor(private readonly profilePicturesService: ProfilePicturesService) { }

  @ApiCreatedResponse({ type: ProfilePictureEntity })
  @Post()
  create(@Body() createProfilePictureDto: CreateProfilePictureDto) {
    return this.profilePicturesService.create(createProfilePictureDto);
  }

  @ApiOkResponse({ type: ProfilePictureEntity, isArray: true })
  @Get()
  findAll() {
    return this.profilePicturesService.findAll();
  }

  @ApiOkResponse({ type: ProfilePictureEntity })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilePicturesService.findOne(id);
  }

  @ApiOkResponse({ type: ProfilePictureEntity })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfilePictureDto: UpdateProfilePictureDto) {
    return this.profilePicturesService.update(id, updateProfilePictureDto);
  }

  @ApiOkResponse({ type: ProfilePictureEntity })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilePicturesService.remove(id);
  }
}
