import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from '../dto/payments-create-charge.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NOTIFICATIONS_SERVICE } from '@app/common';

@Injectable()
export class PaymentsService {
  private logger: Logger = new Logger(PaymentsService.name);

  @InjectStripe() private readonly stripe: Stripe;

  constructor(
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {}

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

      this.notificationsService.emit('notify_email', {
        email,
        text: `Your payment of $${amount} has completed successfully.`,
      });

      this.logger.log('Payment finished');
      return paymentIntent;
    } catch (err) {
      this.logger.error(`Payment error: ${err}`);
      throw new RpcException('Payment could not be received');
    }
  }
}
