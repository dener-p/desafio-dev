import { FastifyRequest } from 'fastify';

export function getCookieHelper(req: FastifyRequest, cookieName: string) {
  const cookies = req.headers.cookie;
  return cookies
    ?.split(';')
    .find((c) => c.includes(cookieName))
    ?.split('=')[1];
}
