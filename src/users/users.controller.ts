import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiCreatedResponse,
} from "@nestjs/swagger";
import { Role } from "../auth/enums/roles.enum";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserEntity } from "./entities/user.entity";
import { AuthRequest } from "src/auth/entities/auth-request.entity";

@ApiBearerAuth()
@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @ApiCreatedResponse({ type: UserEntity })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(Role.Admin)
  @ApiOkResponse({ type: UserEntity, isArray: true })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(Role.Admin)
  @ApiOkResponse({ type: UserEntity })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Roles(Role.Admin)
  @ApiOkResponse({ type: UserEntity })
  @Patch(":id")
  update(@Body() updateUserDto: UpdateUserDto, @Request() req: AuthRequest) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Roles(Role.Admin)
  @ApiOkResponse({ type: UserEntity })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
