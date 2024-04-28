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
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name);
  constructor(
    private primaService: PrismaService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signin(body: AuthDto) {
    const user = await this.userService.getEmail(body.email);
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

    return { accessToken };
  }

  async register(body: AuthDto) {
    const user = await this.userService.getEmail(body.email);

    if (user) {
      throw new ConflictException();
    }

    const hashPassword = await bcrypt.hashSync(body.password, 10);

    await this.userService.createUser({ ...body, password: hashPassword });

    return { message: 'Successfully register ' };
  }
}
