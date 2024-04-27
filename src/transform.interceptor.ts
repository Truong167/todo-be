import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) =>
        data?.message
          ? {
              statusCode: context.switchToHttp().getResponse().statusCode,
              message: data.message,
            }
          : {
              statusCode: context.switchToHttp().getResponse().statusCode,
              data: data,
            },
      ),
    );
  }
}
