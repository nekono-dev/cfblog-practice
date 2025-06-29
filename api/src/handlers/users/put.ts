import { RouteHandler } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import { createPrismaClient } from '@/lib/prisma';

import route from '@/routes/users/put';
import { removeUndefined } from '@/lib/removeUndefined';

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  const parsed = c.req.valid('json');

  const jwtPayload = c.get('jwtPayload') as { sub: string };
  if (parsed.handle !== jwtPayload.sub) {
    return c.json({ error: 'Invalid request' }, 400);
  }
  const handle = parsed.handle;
  const prisma = createPrismaClient(c.env);

  // ユーザが存在するか確認
  const existing = await prisma.user.findUnique({
    where: { handle },
  });
  if (!existing) return c.json({ error: 'User not found' }, 404);
  const data = removeUndefined(parsed);
  await prisma.user.update({
    where: { handle: handle },
    data,
  });
  await prisma.$disconnect();

  return c.json({ message: 'User updated' }, 201);
};

export default handler;
