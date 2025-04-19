import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { HttpExceptionFilter, LoggerModule } from '@app/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [UsersModule, LoggerModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AuthModule {}
