import { OpenAPIHono } from '@hono/zod-openapi';
import { Env } from '@/env';

import addUserHandler from '@/handler/users/post';
import deleteUserHandler from '@/handler/users/delete';
import createUserTokenHandler from '@/handler/users/token/post';
import getUserHandler from '@/handler/users/get';

const app = new OpenAPIHono<{ Bindings: Env }>({ strict: true });

app
	.route('/', addUserHandler)
	.route('/', getUserHandler)
	.route('/', deleteUserHandler)
	.route('/token', createUserTokenHandler);

export default app;
