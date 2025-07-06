import { RouteHandler } from '@hono/zod-openapi';
import { createPrismaClient } from '@/lib/prisma';
import { Env } from '@/common/env';
import route from '@/routes/tags/get';

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  const { label } = c.req.valid('param');
  const prisma = createPrismaClient(c.env);

  try {
    // タグIDを取得
    const tag = await prisma.tag.findUnique({
      where: { label },
      select: { id: true },
    });

    if (!tag) {
      return c.json({ error: 'No pages found' }, 404);
    }

    // tagIdに紐づく pageId を取得
    const pageTags = await prisma.pageTag.findMany({
      where: { tagId: tag.id },
      select: { pageId: true },
    });

    const pageIds = pageTags.map((pt) => pt.pageId);
    if (pageIds.length === 0) {
      return c.json({ error: 'No pages found' }, 404);
    }

    // 該当ページ一覧を取得（isPublic限定）
    const pages = await prisma.page.findMany({
      where: {
        id: { in: pageIds },
        isPublic: true,
      },
      select: {
        id: true,
        pageId: true,
        title: true,
        text: true,
        imgId: true,
        date: true,
      },
    });

    if (pages.length === 0) {
      return c.json({ error: 'No pages found' }, 404);
    }

    // 各ページのタグを個別取得（tag.labelのみ）
    const pageTagMap = new Map<number, string[]>();

    const pageTagRecords = await prisma.pageTag.findMany({
      where: {
        pageId: { in: pages.map((p) => p.id) },
      },
      include: {
        tag: { select: { label: true } },
      },
    });

    for (const pt of pageTagRecords) {
      if (!pageTagMap.has(pt.pageId)) {
        pageTagMap.set(pt.pageId, []);
      }
      pageTagMap.get(pt.pageId)!.push(pt.tag.label);
    }

    // 整形
    const sanitized = pages.map((p) => ({
      pageId: p.pageId,
      title: p.title,
      text: p.text ?? null,
      imgId: p.imgId ?? null,
      date: p.date.toISOString(),
      tags: pageTagMap.get(p.id) ?? [],
    }));

    return c.json({ pages: sanitized }, 200);
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
};

export default handler;
