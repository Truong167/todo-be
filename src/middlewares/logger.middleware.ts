import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.params.id) {
      console.log(
        'Executing request after the function middleware...',
        req.params.id,
      );
    } else {
      console.log(
        'Executing request after the function middleware with no params...',
      );
    }
    next();
  }
}

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log('Request', { url: req.url, method: req.method });
  next();
}
