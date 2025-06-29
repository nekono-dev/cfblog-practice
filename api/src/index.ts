import { OpenAPIHono } from '@hono/zod-openapi';
import { Env } from '@/common/env';
import { swaggerUI } from '@hono/swagger-ui';
// APIs
import { imagesPublicRouter, imagesProtectedRouter } from '@/routes/images';
import { pagesPublicRouter, pagesProtectedRouter } from '@/routes/pages';
import { usersPublicRouter, usersProtectedRouter } from '@/routes/users';

const app = new OpenAPIHono<{ Bindings: Env }>({ strict: true });

// 同じrouteになるとmiddlewareが上書きされるため、意図的に変更する必要あり
app
  .basePath('/s')
  .route('/', imagesProtectedRouter)
  .route('/', pagesProtectedRouter)
  .route('/', usersProtectedRouter);

app
  .route('/', imagesPublicRouter)
  .route('/', pagesPublicRouter)
  .route('/', usersPublicRouter);

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

export default app;
