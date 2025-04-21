import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationIdRequestDto } from './dto/reservation-id-request.dto';
import { CurrentUser, JwtAuthGuard, UserDto } from '@app/common';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @CurrentUser() user: UserDto,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    return await this.reservationsService.create(
      user._id,
      createReservationDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.reservationsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param() param: ReservationIdRequestDto) {
    return await this.reservationsService.findOne(param.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param() param: ReservationIdRequestDto,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return await this.reservationsService.update(
      param.id,
      updateReservationDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param() param: ReservationIdRequestDto) {
    return await this.reservationsService.remove(param.id);
  }
}
