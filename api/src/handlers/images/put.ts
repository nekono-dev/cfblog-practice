import { RouteHandler } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import { createPrismaClient } from '@/lib/prisma';
import route from '@/routes/images/put';

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

  const contentType = c.req.header('Content-Type');
  if (!contentType || !contentType.startsWith('image/')) {
    return c.json({ error: 'Unsupported Content-Type' }, 415);
  }

  const body = await c.req.arrayBuffer();
  if (body.byteLength === 0) {
    return c.json({ error: 'Uploaded image is empty' }, 400);
  }

  const extension = contentType.split('/')[1];
  const filename = `${crypto.randomUUID().replace(/-/g, '')}.${extension}`;

  await c.env.BUCKET.put(filename, body, {
    httpMetadata: { contentType },
  });

  return c.json({ message: 'Image uploaded', key: filename }, 201);
};

export default handler;
