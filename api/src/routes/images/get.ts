import { OpenAPIHono } from '@hono/zod-openapi';
import { Env } from '@/env';
import route from '@/models/images/get';

const imageGetApp = new OpenAPIHono<{ Bindings: Env }>({ strict: true });

imageGetApp.openapi(route, async (c) => {
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

export default imageGetApp;
