import { OpenAPIHono } from '@hono/zod-openapi';
import { Env } from '@/env';

import createPageHandler from '@/handler/pages/post';
import deletePageHandler from '@/handler/pages/delete';
import getPageHandler from '@/handler/pages/get';

const app = new OpenAPIHono<{ Bindings: Env }>({ strict: true });

app
	.route('/', createPageHandler)
	.route('/', getPageHandler)
	.route('/', deletePageHandler);

export default app;
