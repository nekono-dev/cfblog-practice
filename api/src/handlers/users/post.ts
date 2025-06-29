import { RouteHandler } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import { createPrismaClient } from '@/lib/prisma';
import { hashPassword } from '@/lib/bcrypt';
import route from '@/routes/users/post';

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  const { handle, passwd } = c.req.valid('json');
  // clientの作成
  const prisma = createPrismaClient(c.env);

  // すでにユーザがいるか確認
  const existing = await prisma.user.findUnique({ where: { handle } });
  if (existing) return c.json({ error: 'Handle already in use' }, 403);

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
  await prisma.$disconnect();
  return c.json({ message: 'User created' }, 201);
};

export default handler;
