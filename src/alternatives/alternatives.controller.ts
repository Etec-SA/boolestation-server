import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { AlternativesService } from "./alternatives.service";
import { CreateAlternativeDto } from "./dto/create-alternative.dto";
import { UpdateAlternativeDto } from "./dto/update-alternative.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Role } from "../auth/enums/roles.enum";
import { Roles } from "../auth/decorators/roles.decorator";
import { AlternativeEntity } from "./entities/alternative.entity";

@ApiTags("alternatives")
@Controller("alternatives")
export class AlternativesController {
  constructor(private readonly alternativesService: AlternativesService) {}

  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: AlternativeEntity })
  @Post()
  create(@Body() createAlternativeDto: CreateAlternativeDto) {
    return this.alternativesService.create(createAlternativeDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: AlternativeEntity, isArray: true })
  @Get()
  findAll() {
    return this.alternativesService.findAll();
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: AlternativeEntity })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.alternativesService.findOne(id);
  }

  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOkResponse({ type: AlternativeEntity })
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateAlternativeDto: UpdateAlternativeDto
  ) {
    return this.alternativesService.update(id, updateAlternativeDto);
  }

  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOkResponse({ type: AlternativeEntity })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.alternativesService.remove(id);
  }
}
