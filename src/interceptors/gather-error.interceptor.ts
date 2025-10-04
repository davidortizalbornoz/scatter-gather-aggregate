import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GatherException } from '../exceptions/gather.exception';

@Injectable()
export class GatherErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        // Si el error ya tiene la estructura que esperamos, lo preservamos
        if (error.statusCode && error.details) {
          throw new GatherException(error);
        }

        // Si no, construimos un error con la estructura deseada
        const fullError = {
          statusCode: 500,
          message: 'Unexpected Error - Internal Error Processing',
          error: 'Unprocessable Entity',
          timestamp: new Date().toISOString(),
          path: context.switchToHttp().getRequest().url,
          details: {
            phase: 'gather',
            errorMessage: error.message || 'Unknown error',
            errorType: error.name || error.constructor.name,
          }
        };

        throw new GatherException(fullError);
      })
    );
  }
}
