import { Env } from '@/common/env';
import createOpenApiHono from '@/lib/hono';

// protected
import imagePutRoute from '@/routes/images/put';
import imagePutHandler from '@/handlers/images/put';
import imageDeleteRoute from '@/routes/images/delete';
import imageDeleteHandler from '@/handlers/images/delete';

export const imagesRestrictedRouter = createOpenApiHono<{ Bindings: Env }>();

imagesRestrictedRouter.openapi(imagePutRoute, imagePutHandler);
imagesRestrictedRouter.openapi(imageDeleteRoute, imageDeleteHandler);

// public
import imageGetRoute from '@/routes/images/get';
import imageGetHandler from '@/handlers/images/get';

export const imagesPublicRouter = createOpenApiHono<{ Bindings: Env }>();

imagesPublicRouter.openapi(imageGetRoute, imageGetHandler);
