import { RouteHandler } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import { createPrismaClient } from '@/lib/prisma';
import { removeUndefined } from '@/lib/removeUndefined';
import route from '@/routes/pages/put';

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  const jwtPayload = c.get('jwtPayload') as { sub: string };
  const prisma = createPrismaClient(c.env);

  const { pageId: oldPageId } = c.req.valid('param');
  const parsed = c.req.valid('json');

  const user = await prisma.user.findUnique({
    where: { handle: jwtPayload.sub },
    select: { writeAble: true },
  });

  if (!user?.writeAble) {
    return c.json({ error: 'Method Not Allowed' }, 405);
  }

  const page = await prisma.page.findUnique({
    where: { pageId: oldPageId },
    select: { id: true },
  });

  if (!page) {
    return c.json({ error: 'Page not found' }, 404);
  }

  // tags を除いた parsed を removeUndefined に渡す
  const { tags: _, ...parsedForUpdate } = parsed;
  // ページ本体の更新（pageIdも含む）
  const pageUpdateData = removeUndefined(parsedForUpdate);

  if (Object.keys(pageUpdateData).length > 0) {
    await prisma.page.update({
      where: { pageId: oldPageId },
      data: pageUpdateData,
    });
  }

  // タグの置き換え処理（あれば）
  if (parsed.tags) {
    const existingTags = await prisma.tag.findMany({
      where: { label: { in: parsed.tags } },
      select: { id: true, label: true },
    });

    const existingLabelSet = new Set(existingTags.map((t) => t.label));
    const newLabels = parsed.tags.filter(
      (label) => !existingLabelSet.has(label)
    );

    if (newLabels.length > 0) {
      await prisma.tag.createMany({
        data: newLabels.map((label) => ({ label })),
      });
    }

    const allTags = await prisma.tag.findMany({
      where: { label: { in: parsed.tags } },
      select: { id: true },
    });

    await prisma.pageTag.deleteMany({
      where: { pageId: page.id },
    });

    await prisma.pageTag.createMany({
      data: allTags.map((tag) => ({
        pageId: page.id,
        tagId: tag.id,
      })),
    });
  }

  return c.json({ message: 'Page updated' }, 200);
};

export default handler;
