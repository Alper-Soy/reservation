import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENTS_SERVICE, UserDto } from '@app/common';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';

@Injectable()
export class ReservationsService {
  private logger: Logger = new Logger(ReservationsService.name);

  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}

  public async create(
    createReservationDto: CreateReservationDto,
    { email, _id: userId }: UserDto,
  ) {
    try {
      const paymentIntent = await firstValueFrom(
        this.paymentsService
          .send('create_charge', { ...createReservationDto.charge, email })
          .pipe(
            timeout(5000),
            catchError((err) => throwError(() => err)),
          ),
      );

      return await this.reservationsRepository.create({
        ...createReservationDto,
        invoiceId: paymentIntent.id,
        timestamp: new Date(),
        userId,
      });
    } catch (err) {
      this.logger.error(err.message || err);
      throw new BadRequestException(err.message || 'Payment failed');
    }
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
