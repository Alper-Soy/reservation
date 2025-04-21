import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { User, USERS_SERVICE } from '@app/common';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(USERS_SERVICE) private readonly usersClient: ClientProxy,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>
          request?.cookies?.Authentication ||
          request?.Authentication ||
          request?.headers.Authentication,
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPayload): Promise<User> {
    return firstValueFrom(
      this.usersClient.send<User>('get_auth_user', { _id: payload.sub }).pipe(
        timeout(5000),
        catchError((error) => {
          throw new UnauthorizedException(error);
        }),
      ),
    );
  }
}
