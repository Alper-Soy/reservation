import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            levelFirst: false,
            hideObject: true,
            messageFormat:
              '[{context}] reqId:{req.id} - method:{req.method} - url:{req.url} - message:' +
              ' {msg}',
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname,service',
          },
        },
      },
    }),
  ],
})
export class LoggerModule {}
