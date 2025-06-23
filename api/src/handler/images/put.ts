import { OpenAPIHono } from '@hono/zod-openapi';
import { Env } from '@/env';
import route from '@/models/images/put';

const app = new OpenAPIHono<{ Bindings: Env }>({ strict: true });

app.openapi(route, async (c) => {
	const contentType = c.req.header('Content-Type');
	if (!contentType || !contentType.startsWith('image/')) {
		return c.json({ error: 'Unsupported Content-Type' }, 415);
	}

	const body = await c.req.arrayBuffer();
	if (body.byteLength === 0) {
		return c.json({ error: 'Uploaded image is empty' }, 400);
	}

	const extension = contentType.split('/')[1];
	const filename = `${crypto.randomUUID().replace(/-/g, '')}.${extension}`;
	await c.env.BUCKET.put(filename, body, { httpMetadata: { contentType } });

	return c.json({ message: 'Image uploaded', key: filename }, 201);
});

export default app;
