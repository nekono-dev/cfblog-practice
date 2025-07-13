import { RouteHandler } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import { createPrismaClient } from '@/lib/prisma';
import route from '@/routes/images/delete';

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  const jwtPayload = c.get('jwtPayload') as { sub: string };
  const prisma = createPrismaClient(c.env);

  const user = await prisma.user.findUnique({
    where: { handle: jwtPayload.sub },
    select: {
      role: {
        select: { writeAble: true },
      },
    },
  });

  if (!user?.role.writeAble) {
    return c.json({ error: 'Method Not Allowed' }, 405);
  }

  const parsed = c.req.valid('json');
  if (!parsed) {
    return c.json({ error: 'Invalid request' }, 400);
  }
  const object = await c.env.BUCKET.get(parsed.key);
  if (!object) {
    return c.json({ error: 'Image not found' }, 404);
  }
  try {
  } catch (e: unknown) {
    console.log(e);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
  await c.env.BUCKET.delete(parsed.key);

  return c.json({ message: 'Image deleted' }, 200);
};

export default handler;
