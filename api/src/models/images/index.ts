import { OpenAPIHono } from '@hono/zod-openapi';
import { Env } from '@/env';

import uploadImageHandler from '@/handler/images/put';
import deleteImageHandler from '@/handler/images/delete';
import getImageHandler from '@/handler/images/get';

const app = new OpenAPIHono<{ Bindings: Env }>({ strict: true });

app
	.route('/', uploadImageHandler)
	.route('/', getImageHandler)
	.route('/', deleteImageHandler);

export default app;
