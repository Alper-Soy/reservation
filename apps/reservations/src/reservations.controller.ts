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
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param() param: ReservationIdRequestDto) {
    return this.reservationsService.findOne(param.id);
  }

  @Patch(':id')
  update(
    @Param() param: ReservationIdRequestDto,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(param.id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param() param: ReservationIdRequestDto) {
    return this.reservationsService.remove(param.id);
  }
}
