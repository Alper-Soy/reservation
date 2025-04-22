import { Injectable, Logger } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from '../dto/payments-create-charge.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {
  private logger: Logger = new Logger(PaymentsService.name);

  @InjectStripe() private readonly stripe: Stripe;

  async createCharge({ amount, email }: PaymentsCreateChargeDto) {
    try {
      this.logger.log(`Payment started with user:${email}`);
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100,
        confirm: true,
        currency: 'usd',
        payment_method: 'pm_card_visa',
        return_url: 'http://localhost:3000',
      });

      this.logger.log('Payment finished');
      return paymentIntent;
    } catch (err) {
      this.logger.error(`Payment error: ${err}`);
      throw new RpcException('Payment could not be received');
    }
  }
}
