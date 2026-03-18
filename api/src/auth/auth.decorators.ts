import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { SessionType, UserType } from './auth.service';

// Extend Express request to include the fields the AuthGuard attaches...
interface AuthenticatedRequest extends Request {
  user: UserType;
  session: SessionType;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserType => {
    const req = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return req.user;
  },
);

export const CurrentSession = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): SessionType => {
    const req = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return req.session;
  },
);
