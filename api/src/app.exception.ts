import { HttpException, HttpStatus } from '@nestjs/common';

interface AppExceptionOptions {
  message: string;
  cause: string;
  status?: HttpStatus;
}

export class AppException extends HttpException {
  constructor({
    message,
    cause,
    status = HttpStatus.BAD_REQUEST,
  }: AppExceptionOptions) {
    super(
      {
        statusCode: status,
        message,
        cause,
      },
      status,
    );
  }
}
