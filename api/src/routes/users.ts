import { OpenAPIHono } from '@hono/zod-openapi';
import { Env } from '@/common/env';

import addUserHandler from '@/handlers/users/post';
import deleteUserHandler from '@/handlers/users/delete';
import createUserTokenHandler from '@/handlers/users/token/post';
import getUserHandler from '@/handlers/users/get';

const app = new OpenAPIHono<{ Bindings: Env }>({ strict: true });

app
  .route('/', addUserHandler)
  .route('/', getUserHandler)
  .route('/', deleteUserHandler)
  .route('/token', createUserTokenHandler);

export default app;
