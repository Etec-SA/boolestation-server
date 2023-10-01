import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from "@nestjs/common";
import { LevelStatesService } from "./level-states.service";
import { CreateLevelStateDto } from "./dto/create-level-state.dto";
import { UpdateLevelStateDto } from "./dto/update-level-state.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { LevelStateEntity } from "./entities/level-state.entity";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/enums/roles.enum";
import { IsPublic } from "../auth/decorators/is-public.decorator";

@ApiTags("level-states")
@Controller("level-states")
export class LevelStatesController {
  constructor(private readonly levelStatesService: LevelStatesService) {}

  @Roles(Role.Admin)
  @ApiCreatedResponse({ type: LevelStateEntity })
  @ApiBearerAuth()
  @Post()
  create(@Body() createLevelStateDto: CreateLevelStateDto) {
    return this.levelStatesService.create(createLevelStateDto);
  }

  @ApiOkResponse({ type: LevelStateEntity, isArray: true })
  @IsPublic()
  @Get()
  findAll() {
    return this.levelStatesService.findAll();
  }

  @ApiOkResponse({ type: LevelStateEntity })
  @IsPublic()
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const levelState = await this.levelStatesService.findOne(id);
    return levelState;
  }

  @Roles(Role.Admin)
  @ApiOkResponse({ type: LevelStateEntity })
  @ApiBearerAuth()
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateLevelStateDto: UpdateLevelStateDto
  ) {
    return this.levelStatesService.update(id, updateLevelStateDto);
  }

  @Roles(Role.Admin)
  @ApiOkResponse({ type: LevelStateEntity })
  @ApiBearerAuth()
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.levelStatesService.remove(id);
  }
}
