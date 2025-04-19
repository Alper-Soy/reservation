import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { MongoServerError } from 'mongodb';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const err: HttpException | Error = exception;

    let responseMessage;
    let status: HttpStatus;
    let statusCode: HttpStatus;
    if (
      err instanceof HttpException &&
      err.getStatus() < HttpStatus.INTERNAL_SERVER_ERROR
    ) {
      const errResponse: string | any = err.getResponse();
      statusCode =
        errResponse.statusCode || (err as any)?.statusCode || HttpStatus.OK;
      const { message, error } =
        errResponse instanceof Object
          ? errResponse
          : { message: errResponse, error: null };
      status = HttpStatus.OK;

      responseMessage = errorMessageArrayToString(message || error);
    } else if (exception.constructor === MongoServerError) {
      status = HttpStatus.OK;
      statusCode = HttpStatus.BAD_REQUEST;
      responseMessage = 'Something went wrong';
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseMessage = 'Something went wrong';
    }

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(responseMessage);
    }

    if (status < HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.warn(responseMessage);
    }

    const result = {
      success: false,
      statusCode: statusCode,
      message: responseMessage,
    };
    response.status(status).json(result);
  }
}

function errorMessageArrayToString(message) {
  if (Array.isArray(message) && message.length) {
    return message[0];
  } else {
    return message;
  }
}
