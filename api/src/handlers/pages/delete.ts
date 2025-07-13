import { RouteHandler } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import { createPrismaClient } from '@/lib/prisma';
import route from '@/routes/pages/delete';

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  const prisma = createPrismaClient(c.env);
  const jwtPayload = c.get('jwtPayload') as { sub: string };

  // 書き込み権限のあるユーザーか判定
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

  const { pageId, option } = c.req.valid('json');

  try {
    const pages = await prisma.page.findMany({
      where: { pageId: { in: pageId } },
      select: { id: true, imgId: true },
    });

    if (pages.length === 0) {
      return c.json({ error: 'Page not found' }, 404);
    }

    const ids = pages.map((p) => p.id);

    if (option?.deleteImage) {
      const imgIds = pages
        .map((p) => p.imgId)
        .filter((id): id is string => !!id);
      await Promise.all(imgIds.map((id) => c.env.BUCKET.delete(id)));
    }

    await prisma.like.deleteMany({ where: { pageId: { in: ids } } });
    await prisma.pageTag.deleteMany({ where: { pageId: { in: ids } } });
    await prisma.page.deleteMany({ where: { id: { in: ids } } });
    await prisma.tag.deleteMany({ where: { pages: { none: {} } } });

    return c.json({ message: 'Page deleted' }, 200);
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
};

export default handler;
