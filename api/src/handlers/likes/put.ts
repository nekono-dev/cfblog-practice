import { RouteHandler } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import { createPrismaClient } from '@/lib/prisma';
import route from '@/routes/likes/put';

const ANONYMOUS_USER_ID = 0;

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  const parsed = c.req.valid('json');
  if (!parsed) {
    return c.json({ error: 'Invalid request' }, 400);
  }
  const prisma = createPrismaClient(c.env);
  const { pageId, count } = parsed;

  try {
    const page = await prisma.page.findUnique({
      where: { pageId },
      select: { id: true },
    });
    if (!page) {
      return c.json({ error: 'Page not found' }, 404);
    }

    const jwtPayload = c.get('jwtPayload') as { sub: string } | undefined;
    let userId: number = ANONYMOUS_USER_ID;
    if (jwtPayload?.sub) {
      const user = await prisma.user.findUnique({
        where: { handle: jwtPayload.sub },
        select: { id: true },
      });

      if (!user) {
        return c.json({ error: 'User not found' }, 404);
      }
      userId = user.id;
    }

    // 3. 既存の Like を確認
    const existingLike = await prisma.like.findFirst({
      where: {
        pageId: page.id,
        userId: userId,
      },
    });

    // 4. Like を加算または新規作成
    if (existingLike) {
      await prisma.like.update({
        where: { id: existingLike.id },
        data: { count: existingLike.count + count },
      });
    } else {
      await prisma.like.create({
        data: {
          count,
          pageId: page.id,
          userId,
        },
      });
    }

    return c.json({ message: 'Like registered' }, 200);
  } catch (e: any) {
    console.error(e);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
};

export default handler;
