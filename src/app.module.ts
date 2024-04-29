import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './guard/auth.guard';
import { TodoModule } from './todo/todo.module';
import { UsersModule } from './users/users.module';
import { JwtService } from '@nestjs/jwt';
import { AppService } from './app.service';

@Module({
  imports: [TodoModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
