import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ModulesService } from "./modules.service";
import { CreateModuleDto } from "./dto/create-module.dto";
import { UpdateModuleDto } from "./dto/update-module.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from "@nestjs/swagger";
import { ModuleEntity } from "./entities/module.entity";
import { Role } from "../auth/enums/roles.enum";
import { Roles } from "../auth/decorators/roles.decorator";

@ApiTags("modules")
@Controller("modules")
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ModuleEntity })
  @Post()
  create(@Body() createModuleDto: CreateModuleDto) {
    return this.modulesService.create(createModuleDto);
  }

  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ModuleEntity, isArray: true })
  @Get()
  findAll() {
    return this.modulesService.findAll();
  }

  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ModuleEntity, isArray: true })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.modulesService.findOne(id);
  }

  @Roles(Role.Admin)
  @ApiOkResponse({ type: ModuleEntity })
  @ApiBearerAuth()
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.modulesService.update(id, updateModuleDto);
  }

  @Roles(Role.Admin)
  @ApiOkResponse({ type: ModuleEntity })
  @ApiBearerAuth()
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.modulesService.remove(id);
  }
}
