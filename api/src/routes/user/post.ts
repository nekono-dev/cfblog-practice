import { OpenAPIHono } from '@hono/zod-openapi';
import { Env } from '@/env';
import { createPrismaClient } from '@/lib/prisma';
import { hashPassword } from '@/lib/bcrypt';
import route from '@/models/user/post';

const app = new OpenAPIHono<{ Bindings: Env }>({ strict: true });

app.openapi(route, async (c) => {
	// Jsonのinputだった場合のエラー
	const parsed = c.req.valid('json');

	const handle = parsed.handle;
	const passwd = parsed.passwd;

	// clientの作成
	const prisma = createPrismaClient(c.env);

	// すでにユーザがいるか確認
	const existing = await prisma.user.findUnique({ where: { handle } });
	if (existing) return c.json({ error: 'Handle already in use' }, 400);

	// パスワードをハッシュ化
	const hashedPassword = hashPassword(passwd);

	// ユーザ登録
	await prisma.user.create({
		data: {
			handle,
			name: handle,
			hashedPassword,
		},
	});

	return c.json({ message: 'User created' }, 201);
});

export default app;
