import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from "@nestjs/swagger";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/enums/roles.enum";
import { LessonEntity } from "./entities/lesson.entity";
import { GetLessonEntity } from "./entities/get-lesson.entity";

@ApiTags("lessons")
@Controller("lessons")
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: LessonEntity })
  @Post()
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: GetLessonEntity, isArray: true })
  @Get()
  findAll() {
    return this.lessonsService.findAll();
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: GetLessonEntity })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.lessonsService.findOne(id);
  }

  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOkResponse({ type: LessonEntity })
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOkResponse({ type: LessonEntity })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.lessonsService.remove(id);
  }
}
