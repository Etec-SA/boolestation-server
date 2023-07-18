import { Controller, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './entities/auth-request.entity';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { IsPublic } from './decorators/is-public.decorator';

@ApiTags('authentication')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiBody({
    schema: {
      example: {
        email: "youremail@email.com",
        password: "yourpassword"
      }
    }
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @IsPublic()
  async login(@Request() req: AuthRequest) {
    return await this.authService.login(req.user);
  }
}
