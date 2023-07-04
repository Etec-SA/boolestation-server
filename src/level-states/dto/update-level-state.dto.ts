import { PartialType } from '@nestjs/mapped-types';
import { CreateLevelStateDto } from './create-level-state.dto';

export class UpdateLevelStateDto extends PartialType(CreateLevelStateDto) { }
