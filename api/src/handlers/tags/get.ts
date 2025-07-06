import { RouteHandler } from '@hono/zod-openapi'
import { createPrismaClient } from '@/lib/prisma'
import { Env } from '@/common/env'
import route from '@/routes/tags/get'

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  const { label } = c.req.valid('param')
  const prisma = createPrismaClient(c.env)

  try {
    const tag = await prisma.tag.findUnique({
      where: { label },
      select: { id: true },
    })

    if (!tag) {
      return c.json({ error: 'No pages found for the tag' }, 404)
    }

    const pages = await prisma.page.findMany({
      where: {
        tags: { some: { id: tag.id } },
        isPublic: true,
      },
      select: {
        pageId: true,
        title: true,
        text: true,
        imgId: true,
        date: true,
        tags: {
          select: { label: true },
        },
      },
    })

    if (pages.length === 0) {
      return c.json({ error: 'No pages found for the tag' }, 404)
    }

    const sanitized = pages.map((p) => ({
      pageId: p.pageId,
      title: p.title,
      text: p.text ?? null,
      imgId: p.imgId ?? null,
      date: p.date.toISOString(),
      tags: p.tags.map((t) => t.label),
    }))

    return c.json({ pages: sanitized }, 200)
  } catch (e) {
    console.error(e)
    return c.json({ error: 'Internal Server Error' }, 500)
  } finally {
    await prisma.$disconnect()
  }
}

export default handler