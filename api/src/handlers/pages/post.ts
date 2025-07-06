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

    const existingMap = new Map(existingTags.map((t) => [t.label, t.id]));
    const newLabels = parsed.tags.filter((label) => !existingMap.has(label));

    let newTagEntries: { id: number; label: string }[] = [];

    if (newLabels.length > 0) {
      await prisma.tag.createMany({
        data: newLabels.map((label) => ({ label })),
      });

      const newTags = await prisma.tag.findMany({
        where: { label: { in: newLabels } },
        select: { id: true, label: true },
      });

      newTagEntries = newTags;
    }

    const allTags = [
      ...existingTags.map((t) => t.id),
      ...newTagEntries.map((t) => t.id),
    ];

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
        tagId: tag,
      })),
    });

    return c.json({ message: 'Page created' }, 201);
  } catch (e: any) {
    console.error(e);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
};

export default handler;
