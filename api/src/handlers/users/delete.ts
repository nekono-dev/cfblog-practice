import { RouteHandler } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import { createPrismaClient } from '@/lib/prisma';
import { comparePassword } from '@/lib/bcrypt';
import route from '@/routes/users/delete';

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  const { passwd } = c.req.valid('json');

  const jwtPayload = c.get('jwtPayload') as { sub: string };
  const handle = jwtPayload.sub;

  // clientの作成
  const prisma = createPrismaClient(c.env);
  // ユーザが存在するか確認
  const user = await prisma.user.findUnique({ where: { handle: handle } });
  if (!user) return c.json({ error: 'Authorization failed' }, 401);

  const valid = comparePassword(passwd, user.hashedPassword);
  if (!valid) {
    return c.json({ error: 'Authorization failed' }, 401);
  }

  // ユーザ削除
  await prisma.$transaction([
    prisma.like.updateMany({
      where: { userId: user.id },
      data: { userId: 0 }, // anonyユーザに移譲
    }),
    prisma.user.delete({ where: { id: user.id } }),
  ]);
  return c.json({ message: 'User deleted' }, 200);
};

export default handler;
