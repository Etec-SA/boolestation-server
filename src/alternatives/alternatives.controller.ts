import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlternativesService } from './alternatives.service';
import { CreateAlternativeDto } from './dto/create-alternative.dto';
import { UpdateAlternativeDto } from './dto/update-alternative.dto';

@Controller('alternatives')
export class AlternativesController {
  constructor(private readonly alternativesService: AlternativesService) {}

  @Post()
  create(@Body() createAlternativeDto: CreateAlternativeDto) {
    return this.alternativesService.create(createAlternativeDto);
  }

  @Get()
  findAll() {
    return this.alternativesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alternativesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlternativeDto: UpdateAlternativeDto) {
    return this.alternativesService.update(+id, updateAlternativeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alternativesService.remove(+id);
  }
}
