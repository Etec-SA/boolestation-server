import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { LevelStatesService } from './level-states.service';
import { CreateLevelStateDto } from './dto/create-level-state.dto';
import { UpdateLevelStateDto } from './dto/update-level-state.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LevelStateEntity } from './entities/level-state.entity';

@ApiTags('level-states')
@Controller('level-states')
export class LevelStatesController {
  constructor(private readonly levelStatesService: LevelStatesService) { }

  @ApiCreatedResponse({ type: LevelStateEntity })
  @Post()
  create(@Body() createLevelStateDto: CreateLevelStateDto) {
    return this.levelStatesService.create(createLevelStateDto);
  }

  @ApiOkResponse({ type: LevelStateEntity, isArray: true })
  @Get()
  findAll() {
    return this.levelStatesService.findAll();
  }

  @ApiOkResponse({ type: LevelStateEntity })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const levelState = await this.levelStatesService.findOne(id);
    return levelState;
  }

  @ApiOkResponse({ type: LevelStateEntity })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLevelStateDto: UpdateLevelStateDto) {
    return this.levelStatesService.update(id, updateLevelStateDto);
  }

  @ApiOkResponse({ type: LevelStateEntity })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.levelStatesService.remove(id);
  }
}
