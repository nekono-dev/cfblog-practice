import { RouteHandler } from '@hono/zod-openapi';
import { createPrismaClient } from '@/lib/prisma';
import { Env } from '@/common/env';
import { comparePassword } from '@/lib/bcrypt';
import { sign } from 'hono/jwt';
import route from '@/routes/users/token/post';

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  const parsed = c.req.valid('json');
  const handle = parsed.handle;
  const passwd = parsed.passwd;

  const prisma = createPrismaClient(c.env);

  // Roleと一緒にユーザ情報を取得
  const user = await prisma.user.findUnique({
    where: { handle },
    select: {
      handle: true,
      hashedPassword: true,
      role: {
        select: { loginAble: true },
      },
    },
  });

  if (!user || !user.role.loginAble)
    return c.json({ error: 'Login not permitted' }, 403);

  const valid = comparePassword(passwd, user.hashedPassword);
  if (!valid) return c.json({ error: 'Invalid credentials' }, 401);

  const token = await sign(
    { sub: user.handle, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
    c.env.JWT_SECRET,
    'HS256'
  );

  return c.json({ token: token }, 201);
};

export default handler;
