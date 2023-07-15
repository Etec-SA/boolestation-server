import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
    
    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(){
      return 'login';
    }
}
