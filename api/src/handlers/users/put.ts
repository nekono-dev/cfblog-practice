import { RouteHandler } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import { createPrismaClient } from '@/lib/prisma';
import route from '@/routes/users/put';
import { removeUndefined } from '@/lib/removeUndefined';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  const parsed = c.req.valid('json');

  const jwtPayload = c.get('jwtPayload') as { sub: string };

  const handle = jwtPayload.sub;
  const prisma = createPrismaClient(c.env);

  // ユーザが存在するか確認
  const existing = await prisma.user.findUnique({
    where: { handle },
  });
  if (!existing) return c.json({ error: 'User not found' }, 404);
  const data = removeUndefined(parsed);
  try {
    await prisma.user.update({
      where: { handle: handle },
      data,
    });
    return c.json({ message: 'User updated' }, 201);
  } catch (e: unknown) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
      return c.json({ error: 'New handle already in use' }, 409);
    }
    return c.json({ error: 'Internal server error' }, 500);
  }
};

export default handler;
