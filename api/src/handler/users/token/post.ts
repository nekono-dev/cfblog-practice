import { OpenAPIHono } from '@hono/zod-openapi';
import { Env } from '@/env';
import { sign } from 'hono/jwt';
import { createPrismaClient } from '@/lib/prisma';
import { comparePassword } from '@/lib/bcrypt';
import route from '@/models/users/token/post';

const app = new OpenAPIHono<{ Bindings: Env }>({ strict: true });

app.openapi(route, async (c) => {
	// Jsonのinputだった場合のエラー
	const parsed = c.req.valid('json');

	const handle = parsed.handle;
	const passwd = parsed.passwd;
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
	return c.json({ token: token }, 201);
});

export default app;
