/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponse } from '../interfaces';
import { Request } from 'express';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  private getDefaultMessage(method: string): string {
    switch (method) {
      case 'GET':
        return 'Successfully retrieved';
      case 'POST':
        return 'Created successfully';
      case 'PATCH':
        return 'Updated successfully';
      case 'DELETE':
        return 'Deleted successfully';
      default:
        return 'Successfully';
    }
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const request = context.switchToHttp().getRequest<Request>();
        let finalMessage = this.getDefaultMessage(request.method);

        if (data && typeof data === 'object' && 'message' in data) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          finalMessage = data.message as string;

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { message, ...rest } = data;
          data = Object.keys(rest).length > 0 ? rest : undefined;
        }

        if (data && typeof data === 'object' && 'data' in data) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          data = data.data as T;
        }

        return {
          success: true,
          message: finalMessage,
          data,
          date: new Date(),
        };
      }),
    );
  }
}
