import { RouteHandler } from '@hono/zod-openapi';
import { createPrismaClient } from '@/lib/prisma';
import { Env } from '@/common/env';
import { comparePassword } from '@/lib/bcrypt';
import { sign } from 'hono/jwt';
import route from '@/routes/users/token/post';

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  // Jsonのinputだった場合のエラー
  const parsed = c.req.valid('json');

  const handle = parsed.handle;
  const passwd = parsed.passwd;
  // clientの作成
  const prisma = createPrismaClient(c.env);

  // ユーザがいるか確認
  const user = await prisma.user.findUnique({
    where: { handle },
    select: {
      handle: true,
      hashedPassword: true,
      loginAble: true,
    },
  });
  if (!user || !user.loginAble)
    return c.json({ error: 'Login not permitted' }, 403);

  const valid = comparePassword(passwd, user.hashedPassword);
  if (!valid) return c.json({ error: 'Invalid credentials' }, 401);

  const token = await sign(
    { sub: user.handle, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
    c.env.JWT_SECRET,
    'HS256'
  );
  return c.json({ token: token }, 201);
};

export default handler;
