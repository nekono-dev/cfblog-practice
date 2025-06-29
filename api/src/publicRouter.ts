import { Env } from '@/common/env';
import createOpenApiHono from '@/lib/hono';

import imageGetRoute from '@/routes/images/get';
import imageGetHandler from '@/handlers/images/get';

import userPostRoute from '@/routes/users/post';
import userPostHandler from '@/handlers/users/post';
import userTokenRoute from '@/routes/users/token/post';
import userTokenHandler from '@/handlers/users/token/post';

import pageGetRoute from '@/routes/pages/get';
import pageGetHandler from '@/handlers/pages/get';

const publicRouter = createOpenApiHono<{ Bindings: Env }>();

publicRouter.openapi(imageGetRoute, imageGetHandler);
publicRouter.openapi(userTokenRoute, userTokenHandler);
publicRouter.openapi(userPostRoute, userPostHandler);
publicRouter.openapi(pageGetRoute, pageGetHandler);

export default publicRouter;
