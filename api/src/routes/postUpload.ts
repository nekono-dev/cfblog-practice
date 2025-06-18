import { Hono } from 'hono';
import { Env } from '../env';
import { createPrismaClient } from '../lib/prisma';
import { PageInputSchema } from '../lib/schemas';
import { Prisma } from '../generated/prisma';
import { parseJsonBody } from '../lib/request';

const postApp = new Hono<{ Bindings: Env }>({ strict: true });

postApp.post('/', async (c) => {
	const prisma = createPrismaClient(c.env);

	// Jsonのinputだった場合のエラー
	const parsed = await parseJsonBody(c, PageInputSchema);
	if ('error' in parsed) return parsed.error;

	try {
		const body: Prisma.PageCreateInput = parsed.data;
		const result = await prisma.page.create({ data: body });
		return c.json({ message: 'Post created', entry: result }, 200);
	} catch (err) {
		return c.json({ error: 'Internal Server Error' }, 500);
	}
});

export default postApp;
