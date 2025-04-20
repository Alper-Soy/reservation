import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationIdRequestDto } from './dto/reservation-id-request.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  async create(@Body() createReservationDto: CreateReservationDto) {
    return await this.reservationsService.create(createReservationDto);
  }

  @Get()
  async findAll() {
    return await this.reservationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param() param: ReservationIdRequestDto) {
    return await this.reservationsService.findOne(param.id);
  }

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

  @Delete(':id')
  async remove(@Param() param: ReservationIdRequestDto) {
    return await this.reservationsService.remove(param.id);
  }
}
