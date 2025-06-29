import { Env } from '@/common/env';
import { jwtMiddleware } from '@/middleware/jwt';
import createOpenApiHono from '@/lib/hono';

import imagePutRoute from '@/routes/images/put';
import imagePutHandler from '@/handlers/images/put';
import imageDeleteRoute from '@/routes/images/delete';
import imageDeleteHandler from '@/handlers/images/delete';

import userPutRoute from '@/routes/users/put';
import userPutHandler from '@/handlers/users/put';
import userDeleteRoute from '@/routes/users/delete';
import userDeleteHandler from '@/handlers/users/delete';
import userGetRoute from '@/routes/users/get';
import userGetHandler from '@/handlers/users/get';

import pagePostRoute from '@/routes/pages/post';
import pagePostHandler from '@/handlers/pages/post';

const protectRouter = createOpenApiHono<{ Bindings: Env }>();

protectRouter.use('*', jwtMiddleware);
protectRouter.openapi(imagePutRoute, imagePutHandler);
protectRouter.openapi(imageDeleteRoute, imageDeleteHandler);
protectRouter.openapi(userGetRoute, userGetHandler);
protectRouter.openapi(userDeleteRoute, userDeleteHandler);
protectRouter.openapi(userPutRoute, userPutHandler);
protectRouter.openapi(pagePostRoute, pagePostHandler);

export default protectRouter;
