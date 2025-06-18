import { Hono } from 'hono';
import { jwtMiddleware } from '../middleware/jwt';
import { createPrismaClient } from '../lib/prisma';
import { Env } from '../env';

const app = new Hono<{ Bindings: Env }>({ strict: true });
app.use('*', jwtMiddleware);

app.get('/', async (c) => {
	// jwtMiddlewareでセットされた変数を subとして再定義
    // 正体はauthUserで埋め込んだsubの user.handle
	const payload = c.get('jwtPayload') as { sub: string };

	// clientの作成
	const prisma = createPrismaClient(c.env);
	const user = await prisma.user.findUnique({ where: { handle: payload.sub } });
	if (!user) return c.json({ error: 'User not found' }, 404);

	return c.json({ handle: user.handle, name: user.name });
});

export default app;
