import { Injectable } from '@nestjs/common';
import { CreateAlternativeDto } from './dto/create-alternative.dto';
import { UpdateAlternativeDto } from './dto/update-alternative.dto';

@Injectable()
export class AlternativesService {
  create(createAlternativeDto: CreateAlternativeDto) {
    return 'This action adds a new alternative';
  }

  findAll() {
    return `This action returns all alternatives`;
  }

  findOne(id: number) {
    return `This action returns a #${id} alternative`;
  }

  update(id: number, updateAlternativeDto: UpdateAlternativeDto) {
    return `This action updates a #${id} alternative`;
  }

  remove(id: number) {
    return `This action removes a #${id} alternative`;
  }
}
