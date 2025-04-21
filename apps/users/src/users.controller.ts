import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser, JwtAuthGuard, User } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetUserDto } from './dto/get-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUser(@CurrentUser() user: User) {
    return user;
  }

  @MessagePattern('verify_user')
  async verifyUser(@Payload() data: { email: string; password: string }) {
    return this.usersService.verifyUser(data.email, data.password);
  }

  @MessagePattern('get_auth_user')
  async getAuthUser(@Payload() data: GetUserDto) {
    return this.usersService.getUser(data);
  }
}
