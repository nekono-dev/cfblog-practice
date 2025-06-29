import { RouteHandler } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import { createPrismaClient } from '@/lib/prisma';
import route from '@/routes/pages/post';

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  const jwtPayload = c.get('jwtPayload') as { sub: string };
  const prisma = createPrismaClient(c.env);

  // 👇 Role ではなく User 自身の writeAble を参照
  const user = await prisma.user.findUnique({
    where: { handle: jwtPayload.sub },
    select: {
      writeAble: true,
    },
  });

  if (!user?.writeAble) {
    return c.json({ error: 'Method Not Allowed' }, 405);
  }

  const parsed = c.req.valid('json');
  if (!parsed) {
    return c.json({ error: 'Invalid request' }, 400);
  }

  try {
    // 1回目 R: 既存タグを取得（重複作成防止）
    const existingTags = await prisma.tag.findMany({
      where: { label: { in: parsed.tags } },
      select: { id: true, label: true },
    });

    const existingLabelSet = new Set(existingTags.map((t) => t.label));
    const newLabels = parsed.tags.filter(
      (label) => !existingLabelSet.has(label)
    );

    // 2回目 W: 新規タグを必要に応じて作成
    if (newLabels.length > 0) {
      await prisma.tag.createMany({
        data: newLabels.map((label) => ({ label })),
      });
    }

    // 3回目 R: 最終的な全タグIDを取得（connect用）
    const allTags = await prisma.tag.findMany({
      where: { label: { in: parsed.tags } },
      select: { id: true },
    });

    // 4回目 W: ページを作成し、同時にタグをconnect
    await prisma.page.create({
      data: {
        pageId: parsed.pageId,
        title: parsed.title,
        text: parsed.text,
        imgId: parsed.imgId,
        date: parsed.date,
        tags: {
          connect: allTags.map((tag) => ({ id: tag.id })),
        },
      },
    });
    return c.json({ message: 'Page created' }, 201);
  } catch (e: any) {
    console.error(e);
    return c.json({ error: 'Internal Server Error' }, 500);
  } finally {
    await prisma.$disconnect();
  }
};

export default handler;
