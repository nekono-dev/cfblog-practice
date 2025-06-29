import { RouteHandler } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import { createPrismaClient } from '@/lib/prisma';
import route from '@/routes/pages/delete';

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  const prisma = createPrismaClient(c.env);
  const parsed = c.req.valid('json');

  try {
    const page = await prisma.page.findUnique({
      where: { pageId: parsed.pageId },
      select: { id: true, imgId: true },
    });
    if (!page) {
      return c.json({ error: 'Page not found' }, 404);
    }

    // imgが存在し、同時削除するフラグがある場合
    if (page.imgId && parsed.option.deleteImage === true) {
      await c.env.BUCKET.delete(page.imgId);
    }

    // 中間テーブルの削除
    await prisma.$transaction([
      prisma.like.deleteMany({ where: { id: page.id } }),
      prisma.page.delete({ where: { id: page.id } }),
    ]);

    return c.json({ message: 'Page deleted' }, 200);
  } catch (e: unknown) {
    console.log(e);
    return c.json({ error: 'Internal Server Error' }, 500);
  } finally {
    await prisma.$disconnect();
  }
};

export default handler;
