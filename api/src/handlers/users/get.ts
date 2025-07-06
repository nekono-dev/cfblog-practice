import { RouteHandler } from '@hono/zod-openapi';
import { createPrismaClient } from '@/lib/prisma';
import { Env } from '@/common/env';
import route from '@/routes/users/get';

const handler: RouteHandler<typeof route, { Bindings: Env,  }> = async (c) => {
  const handle = c.req.param('handle');
  // handle未設定の場合はエラー
  if (handle === undefined) return c.json({ error: 'Invalid request' }, 400);

  const jwtPayload = c.get('jwtPayload') as { sub: string };

  const prisma = createPrismaClient(c.env);
  const user = await prisma.user.findUnique({
    where: { handle },
  });

  if (!user || !user.loginAble) return c.json({ error: 'User not found' }, 404);

  if (handle === jwtPayload.sub) {
    // 自分のProfileの場合
    return c.json(
      {
        handle: user.handle,
        name: user.name,
        birthday: user.birthday,
      },
      200
    );
  } else {
    // 他ユーザのProfileの場合
    return c.json(
      {
        handle: user.handle,
        name: user.name,
      },
      200
    );
  }
};
export default handler;
