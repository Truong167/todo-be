import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name);
  constructor(
    private primaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signin(body: AuthDto) {
    try {
      const user = await this.primaService.user.findUnique({
        where: {
          email: body.email,
        },
      });
      if (!user) {
        throw new NotFoundException();
      }
      const isMatchedPassword = await bcrypt.compareSync(
        body.password,
        user.password,
      );

      if (!isMatchedPassword) {
        throw new NotFoundException();
      }
      const accessToken = this.jwtService.sign(
        { userId: user?.id },
        { secret: process.env.JWT_SERECT },
      );

      return { message: accessToken };
    } catch (error) {
      console.log(error);
    }
  }

  async register(body: AuthDto) {
    const user = await this.primaService.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (user) {
      throw new ConflictException();
    }

    const hashPassword = await bcrypt.hashSync(body.password, 10);
    await this.primaService.user.create({
      data: {
        ...body,
        password: hashPassword,
      },
    });

    return { message: 'Successfully register ' };
  }
}
