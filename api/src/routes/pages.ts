import { OpenAPIHono } from '@hono/zod-openapi';
import { Env } from '@/common/env';

import createPageHandler from '@/handlers/pages/post';
import deletePageHandler from '@/handlers/pages/delete';
import getPageHandler from '@/handlers/pages/get';

const app = new OpenAPIHono<{ Bindings: Env }>({ strict: true });

app
  .route('/', createPageHandler)
  .route('/', getPageHandler)
  .route('/', deletePageHandler);

export default app;
