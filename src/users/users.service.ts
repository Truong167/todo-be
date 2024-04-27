import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  logger = new Logger(UsersService.name);
  constructor(private primaService: PrismaService) {}

  async findAll() {
    return await this.primaService.user.findMany();
  }
}
