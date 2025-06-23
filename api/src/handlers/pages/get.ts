import { OpenAPIHono } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import { createPrismaClient } from '@/lib/prisma';
import route from '@/api/v1/pages/get';

const app = new OpenAPIHono<{ Bindings: Env }>({ strict: true });

app.openapi(route, async (c) => {
  const { pageId } = c.req.valid('param');
  const prisma = createPrismaClient(c.env);
  try {
    const page = await prisma.page.findUnique({
      where: { pageId },
      include: {
        PageTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!page) {
      return c.json({ error: 'Page not found' }, 404);
    }
    // タグのラベルのみ出力
    const tags = page.PageTags.map((pt) => pt.tag.label);
    return c.json(
      {
        pageId: page.pageId,
        title: page.title,
        text: page.text,
        imgId: page.imgId,
        date: page.date,
        tags,
      },
      200,
    );
  } catch (e: unknown) {
    console.log(e);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

export default app;
