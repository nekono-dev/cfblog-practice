import { RouteHandler } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import { createPrismaClient } from '@/lib/prisma';
import route from '@/routes/pages/list/get';

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  const prisma = createPrismaClient(c.env);

  try {
    const pages = await prisma.page.findMany({
      where: { isPublic: true },
      include: {
        tags: {
          select: {
            tag: {
              select: { label: true },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    const result = pages.map((page) => ({
      pageId: page.pageId,
      title: page.title,
      text: page.text,
      imgId: page.imgId,
      date: page.date,
      tags: page.tags.map((pt) => pt.tag.label),
    }));

    return c.json({ pages: result }, 200);
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
};

export default handler;
