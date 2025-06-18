import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { createPrismaClient } from '../lib/prisma';
import { comparePassword } from '../lib/bcrypt';
import { Env } from '../env';
import { parseJsonBody } from '../lib/request';
import { UserLoginInputSchema } from '../lib/schemas';

const app = new Hono<{ Bindings: Env }>({ strict: true });

app.post('/', async (c) => {
    // Jsonのinputだった場合のエラー
    const parsed = await parseJsonBody(c, UserLoginInputSchema);
    if ('error' in parsed) return parsed.error;

	const handle = parsed.data.handle;
	const passwd = parsed.data.passwd;
    // clientの作成
	const prisma = createPrismaClient(c.env);

	// ユーザがいるか確認
	const user = await prisma.user.findUnique({ where: { handle } });
	if (!user) return c.json({ error: 'Invalid credentials' }, 401);

	const valid = comparePassword(passwd, user.hashedPassword);
	if (!valid) return c.json({ error: 'Invalid credentials' }, 401);

	const token = await sign(
		{ sub: user.handle, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
		c.env.JWT_SECRET,
		'HS256'
	);
	return c.json({ token });
});

export default app;
