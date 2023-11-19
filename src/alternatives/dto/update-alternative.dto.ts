import { PartialType } from '@nestjs/swagger';
import { CreateAlternativeDto } from './create-alternative.dto';

export class UpdateAlternativeDto extends PartialType(CreateAlternativeDto) {}
