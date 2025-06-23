import { OpenAPIHono } from '@hono/zod-openapi';
import { Env } from '@/common/env';

import uploadImageHandler from '@/handlers/images/put';
import deleteImageHandler from '@/handlers/images/delete';
import getImageHandler from '@/handlers/images/get';

const app = new OpenAPIHono<{ Bindings: Env }>({ strict: true });

app
  .route('/', uploadImageHandler)
  .route('/', getImageHandler)
  .route('/', deleteImageHandler);

export default app;
