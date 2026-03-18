import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { FastifyReply, FastifyRequest } from 'fastify';
import { db } from 'src/database/database';
import { user, session } from 'src/database/schema';
import { getCookieHelper } from 'src/helpers/get-cookie';
import { SingupDto } from './dto/singup.dto';
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { and, eq, isNull, type InferSelectModel } from 'drizzle-orm';

export type SessionValidationResult =
  | { session: SessionType; user: UserType }
  | { session: null; user: null };

const DOMAIN = process.env.DOMAIN;
const TOKEN = process.env.COOKIE_NAME ?? 'auth_token';
export type UserType = InferSelectModel<typeof user>;
export type SessionType = InferSelectModel<typeof session>;

@Injectable()
export class AuthService {
  async login(res: FastifyReply, userId: number, ip?: string | null) {
    const token = this.generateSessionToken();
    await this.createSession(token, userId, ip);

    this.setSessionTokenCookie(res, token);

    return;
  }
  private generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
  }

  private async createSession(
    token: string,
    userId: number,
    ip?: string | null,
  ): Promise<SessionType> {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    );
    const duration = 1000 * 60 * 60 * 24 * 7;
    const userSession: SessionType = {
      id: sessionId,
      userId: userId,
      expiresAt: new Date(Date.now() + duration),
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: ip ?? null,
      deletedAt: null,
    };
    await db.insert(session).values(userSession);
    return userSession;
  }
  async validateSessionToken(token: string): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    );
    const result = await db
      .select({
        userInfo: user,
        userSession: session,
      })
      .from(session)
      .innerJoin(user, eq(session.userId, user.id))
      .where(and(eq(session.id, sessionId), isNull(session.deletedAt)));
    if (result.length < 1) {
      return { session: null, user: null };
    }
    const { userInfo, userSession } = result[0];
    if (Date.now() >= userSession.expiresAt.getTime()) {
      await db
        .update(session)
        .set({ deletedAt: new Date() })
        .where(eq(session.id, session.id));
      return { session: null, user: null };
    }
    const diff = 1000 * 60 * 60 * 24 * 4;
    const duration = 1000 * 60 * 60 * 24 * 7;

    if (Date.now() >= userSession.expiresAt.getTime() - diff) {
      userSession.expiresAt = new Date(Date.now() + duration);
      await db
        .update(session)
        .set({
          expiresAt: session.expiresAt,
        })
        .where(eq(session.id, session.id));
    }
    return { session: userSession, user: userInfo };
  }
  private async invalidateSession(sessionId: string): Promise<void> {
    await db
      .update(session)
      .set({ deletedAt: new Date() })
      .where(eq(session.id, sessionId));
  }

  sessionCookieName = TOKEN;
  private setSessionTokenCookie(res: FastifyReply, token: string): void {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    if (process.env.NODE_ENV !== 'development') {
      // When deployed over HTTPS
      res.setCookie(this.sessionCookieName, token, {
        httpOnly: true,
        sameSite: 'lax',
        expires: expiresAt,
        secure: true,
        path: '/',
        domain: DOMAIN,
      });
    } else {
      // When deployed over HTTP (localhost)
      res.setCookie(this.sessionCookieName, token, {
        httpOnly: true,
        sameSite: 'lax',
        expires: expiresAt,
        path: '/',
        domain: DOMAIN,
      });
    }
  }
  deleteSessionTokenCookie(res: FastifyReply): void {
    res.setCookie(this.sessionCookieName, '', {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(),
      path: '/',
      domain: DOMAIN,
    });
  }
  getSessionCookieName() {
    return TOKEN;
  }

  async singup(res: FastifyReply, body: SingupDto, ip?: string | null) {
    // 10 because cloudflare, u should use more
    const passwordHashed = await hash(body.password, 10);
    const [userInfo] = await db
      .insert(user)
      .values({
        email: body.email,
        name: body.name,
        passwordHash: passwordHashed,
      })
      .returning({ id: user.id });
    const token = this.generateSessionToken();
    await this.createSession(token, userInfo.id, ip);

    this.setSessionTokenCookie(res, token);

    return;
  }

  async logout(req: FastifyRequest, res: FastifyReply) {
    const token = getCookieHelper(req, this.sessionCookieName);
    if (token) {
      const { session } = await this.validateSessionToken(token);
      if (session) await this.invalidateSession(session.id);
    }

    this.deleteSessionTokenCookie(res);
    return;
  }

  getIp(req: FastifyRequest): string | null {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
    return req.socket?.remoteAddress ?? null;
  }
}
