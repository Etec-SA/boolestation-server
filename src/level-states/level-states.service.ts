import { Injectable } from '@nestjs/common';
import { CreateLevelStateDto } from './dto/create-level-state.dto';
import { UpdateLevelStateDto } from './dto/update-level-state.dto';

@Injectable()
export class LevelStatesService {
  create(createLevelStateDto: CreateLevelStateDto) {
    return 'This action adds a new levelState';
  }

  findAll() {
    return `This action returns all levelStates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} levelState`;
  }

  update(id: number, updateLevelStateDto: UpdateLevelStateDto) {
    return `This action updates a #${id} levelState`;
  }

  remove(id: number) {
    return `This action removes a #${id} levelState`;
  }
}
