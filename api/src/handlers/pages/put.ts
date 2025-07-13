import { RouteHandler } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import { createPrismaClient } from '@/lib/prisma';
import { removeUndefined } from '@/lib/removeUndefined';
import route from '@/routes/pages/page/put';

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  const jwtPayload = c.get('jwtPayload') as { sub: string };
  const prisma = createPrismaClient(c.env);

  const { pageId: oldPageId } = c.req.valid('param');
  const parsed = c.req.valid('json');

  // ユーザーの書き込み権限チェック（role経由）
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

  const page = await prisma.page.findUnique({
    where: { pageId: oldPageId },
    select: { id: true },
  });

  if (!page) {
    return c.json({ error: 'Page not found' }, 404);
  }

  // ページ本体更新
  const { tags: _, ...parsedForUpdate } = parsed;
  const pageUpdateData = removeUndefined(parsedForUpdate);

  if (Object.keys(pageUpdateData).length > 0) {
    await prisma.page.update({
      where: { pageId: oldPageId },
      data: pageUpdateData,
    });
  }

  // タグ更新処理（タグ指定がある場合）
  if (parsed.tags) {
    const existingTags = await prisma.tag.findMany({
      where: { label: { in: parsed.tags } },
      select: { id: true, label: true },
    });
    const existingMap = new Map(existingTags.map((t) => [t.label, t.id]));
    const newLabels = parsed.tags.filter((label) => !existingMap.has(label));

    let allTagIds = [...existingTags.map((t) => t.id)];

    if (newLabels.length > 0) {
      await prisma.tag.createMany({
        data: newLabels.map((label) => ({ label })),
      });
      const newTags = await prisma.tag.findMany({
        where: { label: { in: newLabels } },
        select: { id: true },
      });
      allTagIds = [...allTagIds, ...newTags.map((t) => t.id)];
    }

    const currentPageTags = await prisma.pageTag.findMany({
      where: { pageId: page.id },
      select: { tagId: true },
    });

    const currentTagIds = new Set(currentPageTags.map((t) => t.tagId));
    const newTagIds = new Set(allTagIds);
    const tagsUnchanged =
      currentTagIds.size === newTagIds.size &&
      [...newTagIds].every((id) => currentTagIds.has(id));

    if (!tagsUnchanged) {
      await prisma.pageTag.deleteMany({ where: { pageId: page.id } });
      await prisma.pageTag.createMany({
        data: [...newTagIds].map((tagId) => ({ pageId: page.id, tagId })),
      });
    }
  }

  return c.json({ message: 'Page updated' }, 200);
};

export default handler;
