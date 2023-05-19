import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LevelStatesService } from './level-states.service';
import { CreateLevelStateDto } from './dto/create-level-state.dto';
import { UpdateLevelStateDto } from './dto/update-level-state.dto';

@Controller('level-states')
export class LevelStatesController {
  constructor(private readonly levelStatesService: LevelStatesService) {}

  @Post()
  create(@Body() createLevelStateDto: CreateLevelStateDto) {
    return this.levelStatesService.create(createLevelStateDto);
  }

  @Get()
  findAll() {
    return this.levelStatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.levelStatesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLevelStateDto: UpdateLevelStateDto) {
    return this.levelStatesService.update(+id, updateLevelStateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.levelStatesService.remove(+id);
  }
}
