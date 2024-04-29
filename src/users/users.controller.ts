import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from '../decorator/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
