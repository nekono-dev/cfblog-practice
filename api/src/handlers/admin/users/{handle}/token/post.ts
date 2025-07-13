import { RouteHandler } from '@hono/zod-openapi';
import route from '@/routes/admin/users/{handle}/token/post';
import { Env } from '@/common/env';
import { createPrismaClient } from '@/lib/prisma';
import { sign } from 'hono/jwt';
import { ADMIN_ROLE_ID } from '@/common/constants';

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  const { handle } = c.req.valid('param');
  const { exp } = c.req.valid('json');

  const jwtPayload = c.get('jwtPayload') as { sub: string };

  const prisma = createPrismaClient(c.env);

  try {
    // 呼び出しユーザのrole判定
    const caller = await prisma.user.findUnique({
      where: { handle: jwtPayload.sub },
      select: {
        role: {
          select: { id: true },
        },
      },
    });

    if (caller?.role.id !== ADMIN_ROLE_ID) {
      return c.json({ error: 'Permission denied' }, 403);
    }

    const targetUser = await prisma.user.findUnique({
      where: { handle },
      select: { handle: true },
    });

    if (!targetUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    // デフォルトは1時間（3600秒）
    const expiresIn = exp ?? 60 * 60;

    const token = await sign(
      {
        sub: targetUser.handle,
        exp: Math.floor(Date.now() / 1000) + expiresIn,
      },
      c.env.JWT_SECRET,
      'HS256'
    );

    return c.json({ token: token }, 201);
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
};

export default handler;
