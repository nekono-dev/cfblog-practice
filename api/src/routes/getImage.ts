import { Hono } from 'hono';
import { Env } from '../env';

const imageGetApp = new Hono<{ Bindings: Env }>({ strict: true });

imageGetApp.get('/:key{.+}', async (c) => {
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
