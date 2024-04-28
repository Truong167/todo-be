import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  logger = new Logger(UsersService.name);
  constructor(private primaService: PrismaService) {}

  async findAll() {
    return await this.primaService.user.findMany();
  }

  async getEmail(email: string) {
    return await this.primaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async createUser(data: CreateUserDto) {
    try {
      await this.primaService.user.create({
        data: {
          ...data,
        },
      });
    } catch (error) {
      this.logger.log(error);
    }
  }
}
