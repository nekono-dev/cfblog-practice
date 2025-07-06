import { OpenAPIHono } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import { swaggerUI } from '@hono/swagger-ui';
// APIs
import { imagesPublicRouter, imagesRestrictedRouter } from '@/routes/images';
import { pagesPublicRouter, pagesRestrictedRouter } from '@/routes/pages';
import { usersPublicRouter, usersRestrictedRouter } from '@/routes/users';
import { likesAccessibleRouter } from './routes/likes';

import { jwtMiddleware, jwtOptional } from './middleware/jwt';

const app = new OpenAPIHono<{ Bindings: Env }>({ strict: false });

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
  .route('/', usersPublicRouter);
app
  .use("*",jwtOptional)
  .route("/", likesAccessibleRouter)
app
  .use('*', jwtMiddleware)
  .route('/', imagesRestrictedRouter)
  .route('/', pagesRestrictedRouter)
  .route('/', usersRestrictedRouter);

export default app;
