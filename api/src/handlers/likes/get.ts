import { RouteHandler } from '@hono/zod-openapi';
import { createPrismaClient } from '@/lib/prisma';
import { Env } from '@/common/env';
import route from '@/routes/likes/get';

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  const { pageId } = c.req.valid('param');
  const prisma = createPrismaClient(c.env);

  try {
    const page = await prisma.page.findUnique({
      where: { pageId },
      select: { id: true },
    });

    if (!page) {
      return c.json({ error: 'Page not found' }, 404);
    }

    const result = await prisma.like.aggregate({
      where: { pageId: page.id },
      _sum: { count: true },
    });

    const total = result._sum.count ?? 0;

    return c.json({ pageId, totalLikes: total }, 200);
  } catch (e: any) {
    console.error(e);
    return c.json({ error: 'Internal Server Error' }, 500);
  } finally {
    await prisma.$disconnect();
  }
};

export default handler;
