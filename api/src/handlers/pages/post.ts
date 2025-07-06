import { RouteHandler } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import { createPrismaClient } from '@/lib/prisma';
import route from '@/routes/pages/post';

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  const jwtPayload = c.get('jwtPayload') as { sub: string };
  const prisma = createPrismaClient(c.env);

  const user = await prisma.user.findUnique({
    where: { handle: jwtPayload.sub },
    select: { writeAble: true },
  });

  if (!user?.writeAble) {
    return c.json({ error: 'Method Not Allowed' }, 405);
  }

  const parsed = c.req.valid('json');
  if (!parsed) {
    return c.json({ error: 'Invalid request' }, 400);
  }

  try {
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

    const page = await prisma.page.create({
      data: {
        pageId: parsed.pageId,
        title: parsed.title,
        text: parsed.text,
        imgId: parsed.imgId,
        date: parsed.date,
      },
      select: { id: true },
    });

    await prisma.pageTag.createMany({
      data: allTags.map((tag) => ({
        pageId: page.id,
        tagId: tag.id,
      })),
    });

    return c.json({ message: 'Page created' }, 201);
  } catch (e: any) {
    console.error(e);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
};

export default handler;
