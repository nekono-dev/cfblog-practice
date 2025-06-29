import { RouteHandler } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import route from '@/routes/images/get';

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  const key = c.req.param('key');
  const object = await c.env.BUCKET.get(key);

  if (!object) {
    return c.json({ error: 'Image not found' }, 404);
  }

  return new Response(object.body, {
    headers: {
      'Content-Type':
        object.httpMetadata?.contentType || 'application/octet-stream',
    },
  });
};

export default handler;
