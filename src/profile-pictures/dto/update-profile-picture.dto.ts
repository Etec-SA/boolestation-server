import { PartialType } from '@nestjs/swagger';
import { CreateProfilePictureDto } from './create-profile-picture.dto';

export class UpdateProfilePictureDto extends PartialType(CreateProfilePictureDto) {}
