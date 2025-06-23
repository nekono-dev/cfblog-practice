import { OpenAPIHono } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import route from '@/api/v1/images/delete';

const app = new OpenAPIHono<{ Bindings: Env }>({ strict: true });

app.openapi(route, async (c) => {
  const { key } = c.req.valid('json');
  const object = await c.env.BUCKET.get(key);
  if (!object) {
    return c.json({ error: 'Image not found' }, 404);
  }
  try {
  } catch (e: unknown) {
    console.log(e);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
  await c.env.BUCKET.delete(key);

  return c.json({ message: 'Image deleted' }, 200);
});

export default app;
