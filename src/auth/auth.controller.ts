import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup-dto';
import { LoginDto } from './dto/login-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() data: SignUpDto) {
    return this.authService.createUser(data);
  }

  @Post('login')
  loginUser(@Body() data: LoginDto) {
    return this.authService.loginUser(data);
  }
}
