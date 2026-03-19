import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const IS_PUBLIC_KEY = 'isPublic';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

import { SetMetadata } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private auth: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const http = context.switchToHttp();
    const req = http.getRequest<FastifyRequest>();
    const res = http.getResponse<FastifyReply>();

    // for the test i will be using basic auth, in prodution remove the req.headers.authorization, will should
    // only use the token set by the backend
    const token =
      this.auth.getCookieHelper(req, this.auth.sessionCookieName) ??
      req.headers.authorization?.replace('Bearer ', '').trim();
    if (!token) throw new UnauthorizedException();

    const { session, user } = await this.auth.validateSessionToken(token);
    if (!session || !user) {
      this.auth.deleteSessionTokenCookie(res);
      throw new UnauthorizedException();
    }

    req['session'] = session;
    req['user'] = user;

    return true;
  }
}
