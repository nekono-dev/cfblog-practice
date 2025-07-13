import { OpenAPIHono } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import { swaggerUI } from '@hono/swagger-ui';
// APIs
import { imagesPublicRouter, imagesRestrictedRouter } from '@/routes/images';
import { pagesPublicRouter, pagesRestrictedRouter } from '@/routes/pages';
import { usersPublicRouter, usersRestrictedRouter } from '@/routes/users';
import { likesAccessibleRouter, likesPublicRouter } from './routes/likes';
import { adminRestrictedRouter } from '@/routes/admin/users/{handle}/token';

import { jwtMiddleware, jwtOptional } from '@/middleware/jwt';
import { tagsPublicRouter } from '@/routes/tags';
import { cors } from 'hono/cors';

const app = new OpenAPIHono<{ Bindings: Env }>({ strict: false });

// CORS対応
app.use('/*', cors());
app.use(
  '/*',
  cors({
    origin: '*', // 'http://example.com',
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);
// APIドキュメントを出力
app
  .doc('/openapi.json', {
    openapi: '3.0.0',
    info: {
      title: 'Cfblog-practice API',
      version: '1.0.0',
    },
  })
  .get('/doc', swaggerUI({ url: '/openapi.json' }));

// 同じrouteになるとmiddlewareが上書きされる
// 先にPublicRouterを追加すると回避可能
app
  .route('/', imagesPublicRouter)
  .route('/', pagesPublicRouter)
  .route('/', usersPublicRouter)
  .route('/', likesPublicRouter)
  .route('/', tagsPublicRouter);
app.use('*', jwtOptional).route('/', likesAccessibleRouter);
app
  .use('*', jwtMiddleware)
  .route('/', imagesRestrictedRouter)
  .route('/', pagesRestrictedRouter)
  .route('/', usersRestrictedRouter)
  .route('/', adminRestrictedRouter);

app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

export default app;
