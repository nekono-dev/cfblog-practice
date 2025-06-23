import { OpenAPIHono } from '@hono/zod-openapi';
import { Env } from '@/env';
import { createPrismaClient } from '@/lib/prisma';
import { hashPassword } from '@/lib/bcrypt';
import route from '@/models/users/delete';
import { jwtMiddleware } from '@/middleware/jwt';

const app = new OpenAPIHono<{ Bindings: Env }>({ strict: true });
// トークンで認証したうえで、パスワード情報を取得
app.use('*', jwtMiddleware);

app.openapi(route, async (c) => {
	const { passwd } = c.req.valid('json');

	const payload = c.get('jwtPayload') as { sub: string };
	const handle = payload.sub;

	// clientの作成
	const prisma = createPrismaClient(c.env);
	// ユーザが存在するか確認
	const user = await prisma.user.findUnique({ where: { handle: handle } });
	if (!user) return c.json({ error: 'User not found' }, 404);

	// body中のパスワード情報と、tokenを基に取得したユーザに紐づくhashedPasswordが一致する場合、本人であると判断する
	const hashedPassword = hashPassword(passwd);
	if (user.hashedPassword !== hashedPassword) {
		return c.json({ error: 'Authorization failed' }, 503);
	}

	// ユーザ削除
	await prisma.$transaction([
		prisma.like.deleteMany({ where: { id: user.id } }),
		prisma.user.delete({ where: { id: user.id } }),
	]);

	return c.json({ message: 'User deleted' }, 200);
});

export default app;
