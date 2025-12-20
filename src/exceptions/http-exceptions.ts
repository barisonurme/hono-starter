// Custom error classes
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

export class HttpException extends Error {
  constructor(
    public statusCode: number,
    public message: string = HttpStatusPhrases.INTERNAL_SERVER_ERROR,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string = HttpStatusPhrases.NOT_FOUND) {
    super(HttpStatusCodes.NOT_FOUND, message);
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string = HttpStatusPhrases.BAD_REQUEST) {
    super(HttpStatusCodes.BAD_REQUEST, message);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string = HttpStatusPhrases.UNAUTHORIZED) {
    super(HttpStatusCodes.UNAUTHORIZED, message);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string = HttpStatusPhrases.FORBIDDEN) {
    super(HttpStatusCodes.FORBIDDEN, message);
  }
}

export class ConflictException extends HttpException {
  constructor(message: string = HttpStatusPhrases.CONFLICT) {
    super(HttpStatusCodes.CONFLICT, message);
  }
}

export class UnprocessableEntityException extends HttpException {
  constructor(message: string = HttpStatusPhrases.UNPROCESSABLE_ENTITY) {
    super(HttpStatusCodes.UNPROCESSABLE_ENTITY, message);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message: string = HttpStatusPhrases.INTERNAL_SERVER_ERROR) {
    super(HttpStatusCodes.INTERNAL_SERVER_ERROR, message);
  }
}

