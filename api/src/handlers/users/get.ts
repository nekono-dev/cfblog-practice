import { OpenAPIHono } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import { jwtMiddleware } from '@/middleware/jwt';
import { createPrismaClient } from '@/lib/prisma';
import route from '@/api/v1/users/get';

const app = new OpenAPIHono<{ Bindings: Env }>({ strict: true });
app.use('*', jwtMiddleware);

app.openapi(route, async (c) => {
  const handle = c.req.param('handle');
  // handle未設定の場合はエラー
  if (handle === undefined) return c.json({ error: 'Invalid request' }, 503);

  const payload = c.get('jwtPayload') as { sub: string };

  const prisma = createPrismaClient(c.env);
  const user = await prisma.user.findUnique({
    where: { handle: payload.sub },
  });
  if (!user) return c.json({ error: 'User not found' }, 404);

  if (handle === payload.sub) {
    // 自分のProfileの場合
    return c.json(
      {
        handle: user.handle,
        name: user.name,
        birthday: user.birthday,
      },
      200,
    );
  } else {
    // 他ユーザのProfileの場合
    return c.json(
      {
        handle: user.handle,
        name: user.name,
      },
      200,
    );
  }
});

export default app;
