import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Public } from 'src/decorator/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  signin(@Body() body: AuthDto) {
    return this.authService.signin(body);
  }

  @Post('register')
  register(@Body() body: AuthDto) {
    return this.authService.register(body);
  }
}
