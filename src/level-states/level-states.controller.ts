import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { LevelStatesService } from './level-states.service';
import { CreateLevelStateDto } from './dto/create-level-state.dto';
import { UpdateLevelStateDto } from './dto/update-level-state.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('level-states')
@Controller('level-states')
export class LevelStatesController {
  constructor(private readonly levelStatesService: LevelStatesService) { }

  @Post()
  create(@Body() createLevelStateDto: CreateLevelStateDto) {
    return this.levelStatesService.create(createLevelStateDto);
  }

  @Get()
  findAll() {
    return this.levelStatesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const levelState = await this.levelStatesService.findOne(id);
    if (!levelState) throw new NotFoundException('Level State not found!');
    return levelState;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLevelStateDto: UpdateLevelStateDto) {
    return this.levelStatesService.update(id, updateLevelStateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.levelStatesService.remove(id);
  }
}
