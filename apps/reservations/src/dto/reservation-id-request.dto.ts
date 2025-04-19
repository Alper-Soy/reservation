import { IsDefined, IsMongoId, IsNotEmpty } from 'class-validator';

export class ReservationIdRequestDto {
  @IsMongoId({ message: 'Invalid reservation ID' })
  @IsNotEmpty({ message: 'Invalid reservation ID' })
  @IsDefined()
  id: string;
}
