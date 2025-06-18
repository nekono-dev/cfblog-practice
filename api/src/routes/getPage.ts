import { Hono } from 'hono';
import { Env } from '../env';
import { createPrismaClient } from '../lib/prisma';

const getApp = new Hono<{ Bindings: Env }>({ strict: true });

getApp.get('/:pageId', async (c) => {
	const pageId = c.req.param('pageId');
	const prisma = createPrismaClient(c.env);

	try {
		const page = await prisma.page.findUnique({ where: { pageId } });
		if (!page) return c.json({ error: 'Page not found' }, 404);

		return c.json(page);
	} catch {
		return c.json({ error: 'Internal Server Error' }, 500);
	}
});

export default getApp;