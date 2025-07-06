import { RouteHandler } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import { createPrismaClient } from '@/lib/prisma';
import { comparePassword } from '@/lib/bcrypt';
import route from '@/routes/users/delete';

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  const { passwd } = c.req.valid('json');
  const jwtPayload = c.get('jwtPayload') as { sub: string };
  const handle = jwtPayload.sub;

  const prisma = createPrismaClient(c.env);

  // ユーザ認証
  const user = await prisma.user.findUnique({
    where: { handle },
    select: { id: true, hashedPassword: true },
  });

  if (!user) {
    return c.json({ error: 'Authorization failed' }, 401);
  }

  const valid = comparePassword(passwd, user.hashedPassword);
  if (!valid) {
    return c.json({ error: 'Authorization failed' }, 401);
  }

  // 先にLikeを匿名ユーザ（ID = 0）へ移譲
  await prisma.like.updateMany({
    where: { userId: user.id },
    data: { userId: 0 },
  });

  // ユーザ削除本体
  await prisma.user.delete({
    where: { id: user.id },
  });

  return c.json({ message: 'User deleted' }, 200);
};

export default handler;
