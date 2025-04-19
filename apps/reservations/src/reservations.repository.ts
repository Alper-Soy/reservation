import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { Reservation } from './models/reservation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ReservationsRepository extends AbstractRepository<Reservation> {
  protected logger: Logger = new Logger(ReservationsRepository.name);

  constructor(
    @InjectModel(Reservation.name)
    reservationModel: Model<Reservation>,
  ) {
    super(reservationModel);
  }
}
