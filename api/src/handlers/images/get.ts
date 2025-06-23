import { OpenAPIHono } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import route from '@/api/v1/images/get';

const app = new OpenAPIHono<{ Bindings: Env }>({ strict: true });

app.openapi(route, async (c) => {
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
});

export default app;
