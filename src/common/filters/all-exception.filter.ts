import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ERROR_MESSAGES, ERROR_NAMES } from '../constants/error-messages';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    let error = ERROR_NAMES.INTERNAL_SERVER_ERROR;

    // Handle HTTP exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = this.getErrorName(status);
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message =
          (responseObj.message as string) ||
          exception.message ||
          this.getDefaultMessage(status);
        error = (responseObj.error as string) || this.getErrorName(status);
      } else {
        message = exception.message || this.getDefaultMessage(status);
        error = this.getErrorName(status);
      }
    } else {
      // Handle Sequelize errors
      if (this.isSequelizeError(exception)) {
        const sequelizeError = this.handleSequelizeError(exception as Error);
        status = sequelizeError.status;
        message = sequelizeError.message;
        error = sequelizeError.error;
      } else if (exception instanceof Error) {
        message = exception.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
        error = exception.name || ERROR_NAMES.UNEXPECTED_ERROR;
      } else if (typeof exception === 'string') {
        message = exception;
        error = ERROR_NAMES.UNEXPECTED_ERROR;
      } else {
        message = ERROR_MESSAGES.UNEXPECTED_ERROR;
        error = ERROR_NAMES.UNKNOWN_ERROR;
      }
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    const errorResponse = {
      success: false,
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }

  private isSequelizeError(exception: unknown): boolean {
    return (
      exception instanceof Error &&
      (exception.constructor.name.includes('Sequelize') ||
        exception.constructor.name.includes('ValidationError') ||
        exception.constructor.name.includes('UniqueConstraintError'))
    );
  }

  private handleSequelizeError(exception: Error): {
    status: number;
    message: string;
    error: string;
  } {
    const errorName = exception.constructor.name;

    switch (errorName) {
      case 'SequelizeUniqueConstraintError':
        return {
          status: HttpStatus.CONFLICT,
          message: ERROR_MESSAGES.SEQUELIZE.UNIQUE_CONSTRAINT,
          error: ERROR_NAMES.SEQUELIZE.UNIQUE_CONSTRAINT,
        };

      case 'SequelizeValidationError':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: ERROR_MESSAGES.SEQUELIZE.VALIDATION_ERROR,
          error: ERROR_NAMES.SEQUELIZE.VALIDATION_ERROR,
        };

      case 'SequelizeForeignKeyConstraintError':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: ERROR_MESSAGES.SEQUELIZE.FOREIGN_KEY_CONSTRAINT,
          error: ERROR_NAMES.SEQUELIZE.FOREIGN_KEY_CONSTRAINT,
        };

      case 'SequelizeDatabaseError':
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ERROR_MESSAGES.SEQUELIZE.DATABASE_ERROR,
          error: ERROR_NAMES.SEQUELIZE.DATABASE_ERROR,
        };

      case 'SequelizeConnectionError':
        return {
          status: HttpStatus.SERVICE_UNAVAILABLE,
          message: ERROR_MESSAGES.SEQUELIZE.CONNECTION_ERROR,
          error: ERROR_NAMES.SEQUELIZE.CONNECTION_ERROR,
        };

      case 'SequelizeTimeoutError':
        return {
          status: HttpStatus.REQUEST_TIMEOUT,
          message: ERROR_MESSAGES.SEQUELIZE.TIMEOUT_ERROR,
          error: ERROR_NAMES.SEQUELIZE.TIMEOUT_ERROR,
        };

      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ERROR_MESSAGES.SEQUELIZE.GENERAL_ERROR,
          error: ERROR_NAMES.SEQUELIZE.GENERAL_ERROR,
        };
    }
  }

  private getErrorName(status: number): string {
    switch (status) {
      case 400:
        return ERROR_NAMES.BAD_REQUEST;
      case 401:
        return ERROR_NAMES.UNAUTHORIZED;
      case 403:
        return ERROR_NAMES.FORBIDDEN;
      case 404:
        return ERROR_NAMES.NOT_FOUND;
      case 405:
        return ERROR_NAMES.METHOD_NOT_ALLOWED;
      case 409:
        return ERROR_NAMES.CONFLICT;
      case 422:
        return ERROR_NAMES.VALIDATION_FAILED;
      case 429:
        return ERROR_NAMES.TOO_MANY_REQUESTS;
      case 500:
        return ERROR_NAMES.INTERNAL_SERVER_ERROR;
      case 502:
        return ERROR_NAMES.BAD_GATEWAY;
      case 503:
        return ERROR_NAMES.SERVICE_UNAVAILABLE;
      default:
        return ERROR_NAMES.UNEXPECTED_ERROR;
    }
  }

  private getDefaultMessage(status: number): string {
    switch (status) {
      case 400:
        return ERROR_MESSAGES.BAD_REQUEST;
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 405:
        return ERROR_MESSAGES.METHOD_NOT_ALLOWED;
      case 409:
        return ERROR_MESSAGES.CONFLICT;
      case 422:
        return ERROR_MESSAGES.VALIDATION_FAILED;
      case 429:
        return ERROR_MESSAGES.TOO_MANY_REQUESTS;
      case 500:
        return ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
      case 502:
        return ERROR_MESSAGES.BAD_GATEWAY;
      case 503:
        return ERROR_MESSAGES.SERVICE_UNAVAILABLE;
      default:
        return ERROR_MESSAGES.UNEXPECTED_ERROR;
    }
  }
}
