import { verify } from 'hono/jwt';
import { createMiddleware } from 'hono/factory';
import { Env } from '../common/env';

export const jwtMiddleware = createMiddleware<{
  Bindings: Env;
}>(async (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const payload = await verify(token, c.env.JWT_SECRET, 'HS256');
    c.set('jwtPayload', payload);
    await next();
  } catch (e: unknown) {
    console.log(e);
    return c.json({ error: 'Invalid token' }, 401);
  }
});
