import { Env } from '@/common/env';
import createOpenApiHono from '@/lib/hono';
import { jwtMiddleware } from '@/middleware/jwt';

// protected
import imagePutRoute from '@/routes/images/put';
import imagePutHandler from '@/handlers/images/put';
import imageDeleteRoute from '@/routes/images/delete';
import imageDeleteHandler from '@/handlers/images/delete';

export const imagesProtectedRouter = createOpenApiHono<{ Bindings: Env }>();

imagesProtectedRouter.use('*', jwtMiddleware);
imagesProtectedRouter.openapi(imagePutRoute, imagePutHandler);
imagesProtectedRouter.openapi(imageDeleteRoute, imageDeleteHandler);

// public
import imageGetRoute from '@/routes/images/get';
import imageGetHandler from '@/handlers/images/get';

export const imagesPublicRouter = createOpenApiHono<{ Bindings: Env }>();

imagesPublicRouter.openapi(imageGetRoute, imageGetHandler);
