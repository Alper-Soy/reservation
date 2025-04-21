import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User, USERS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USERS_SERVICE) private readonly usersClient: ClientProxy,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    return firstValueFrom(
      this.usersClient.send<User>('verify_user', { email, password }).pipe(
        timeout(5000),
        catchError((error) => {
          throw new UnauthorizedException(error.message);
        }),
      ),
    );
  }
}
