import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfilePicturesService } from './profile-pictures.service';
import { CreateProfilePictureDto } from './dto/create-profile-picture.dto';
import { UpdateProfilePictureDto } from './dto/update-profile-picture.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProfilePictureEntity } from './entities/profile-picture.entity';
import { Role } from '../auth/enums/roles.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { IsPublic } from '../auth/decorators/is-public.decorator';

@ApiTags('profile-pictures')
@Controller('profile-pictures')
export class ProfilePicturesController {
  constructor(private readonly profilePicturesService: ProfilePicturesService) { }

  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ProfilePictureEntity })
  @Post()
  create(@Body() createProfilePictureDto: CreateProfilePictureDto) {
    return this.profilePicturesService.create(createProfilePictureDto);
  }

  @ApiOkResponse({ type: ProfilePictureEntity, isArray: true })
  @IsPublic()
  @Get()
  findAll() {
    return this.profilePicturesService.findAll();
  }

  @ApiOkResponse({ type: ProfilePictureEntity })
  @IsPublic()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilePicturesService.findOne(id);
  }

  @Roles(Role.Admin)
  @ApiOkResponse({ type: ProfilePictureEntity })
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfilePictureDto: UpdateProfilePictureDto) {
    return this.profilePicturesService.update(id, updateProfilePictureDto);
  }

  @Roles(Role.Admin)
  @ApiOkResponse({ type: ProfilePictureEntity })
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilePicturesService.remove(id);
  }
}
