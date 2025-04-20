import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
  ) {}

  public async create(createReservationDto: CreateReservationDto) {
    return this.reservationsRepository.create({
      ...createReservationDto,
      timestamp: new Date(),
      userId: '123',
    });
  }

  public async findAll() {
    return await this.reservationsRepository.find({});
  }

  public async findOne(_id: string) {
    const reservation = await this.reservationsRepository.findOne({ _id });
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    return reservation;
  }

  public async update(_id: string, updateReservationDto: UpdateReservationDto) {
    const reservation = await this.reservationsRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }

  public async remove(_id: string) {
    return await this.reservationsRepository.findOneAndDelete({ _id });
  }
}
