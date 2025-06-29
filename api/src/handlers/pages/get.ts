import { RouteHandler } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import { createPrismaClient } from '@/lib/prisma';
import route from '@/routes/pages/get';

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  const { pageId } = c.req.valid('param');
  const prisma = createPrismaClient(c.env);
  try {
    const page = await prisma.page.findUnique({
      where: { pageId },
      include: {
        tags: {
          select: { label: true },
        },
      },
    });
    await prisma.$disconnect();

    if (!page) {
      return c.json({ error: 'Page not found' }, 404);
    }

    // タグのラベルのみ抽出
    const tags = page.tags.map((tag) => tag.label);

    return c.json(
      {
        pageId: page.pageId,
        title: page.title,
        text: page.text,
        imgId: page.imgId,
        date: page.date,
        tags,
      },
      200
    );
  } catch (e: unknown) {
    console.error(e);
    return c.json({ error: 'Internal Server Error' }, 500);
  } finally {
    await prisma.$disconnect();
  }
};

export default handler;
