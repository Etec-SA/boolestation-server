import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { ExercisesService } from "./exercises.service";
import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { UpdateExerciseDto } from "./dto/update-exercise.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
} from "@nestjs/swagger";
import { Role } from "../auth/enums/roles.enum";
import { Roles } from "../auth/decorators/roles.decorator";
import { ExerciseEntity } from "./entities/exercise.entity";
import { GetExerciseEntity } from "./entities/get-exercise.entity";

@ApiTags("exercises")
@Controller("exercises")
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ExerciseEntity })
  @Post()
  create(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exercisesService.create(createExerciseDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: GetExerciseEntity, isArray: true })
  @ApiQuery({ name: "lesson-id", required: false, type: String })
  @Get()
  findAll(@Query("lesson-id") lessonId: string) {
    return this.exercisesService.findAll(lessonId);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: GetExerciseEntity })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.exercisesService.findOne(id);
  }

  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ExerciseEntity })
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateExerciseDto: UpdateExerciseDto
  ) {
    return this.exercisesService.update(id, updateExerciseDto);
  }

  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ExerciseEntity })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.exercisesService.remove(id);
  }
}
