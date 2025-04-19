import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule, HttpExceptionFilter, LoggerModule } from '@app/common';
import { ReservationsRepository } from './reservations.repository';
import { Reservation, ReservationSchema } from './models/reservation.schema';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    LoggerModule,
  ],
  controllers: [ReservationsController],
  providers: [
    ReservationsService,
    ReservationsRepository,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class ReservationsModule {}
