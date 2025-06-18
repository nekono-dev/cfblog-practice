import { Hono } from 'hono';
import { Env } from '../env';
import { createPrismaClient } from '../lib/prisma';
import { hashPassword } from '../lib/bcrypt';
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
