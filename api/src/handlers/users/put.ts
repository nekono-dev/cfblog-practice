import { RouteHandler } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import { createPrismaClient } from '@/lib/prisma';
import route from '@/routes/users/put';
import { removeUndefined } from '@/lib/removeUndefined';
import { addProps } from '@/lib/addPrpps';
import { hashPassword } from '@/lib/bcrypt';

const handler: RouteHandler<typeof route, { Bindings: Env }> = async (c) => {
  const parsed = c.req.valid('json');
  const jwtPayload = c.get('jwtPayload') as { sub: string };

  const handle = jwtPayload.sub;
  const prisma = createPrismaClient(c.env);

  // ユーザが存在するか確認
  const existing = await prisma.user.findUnique({
    where: { handle },
  });
  if (!existing) return c.json({ error: 'User not found' }, 404);
  let data = removeUndefined(parsed);
  // パスワードフィールドが変更されている場合
  if (data.passwd !== undefined) {
    delete data.passwd;
    data = addProps(data, { hashedPassword: hashPassword(parsed.passwd!) });
  }
  try {
    await prisma.user.update({
      where: { handle: handle },
      data,
    });
    return c.json({ message: 'User updated' }, 201);
  } catch (e: unknown) {
    console.log(e);
    //return c.json({ error: 'New handle already in use' }, 409);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

export default handler;
