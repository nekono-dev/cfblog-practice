import { Env } from '@/common/env';
import createOpenApiHono from '@/lib/hono';

// protected
import likePutRoute from '@/routes/likes/put';
import likePutHandler from '@/handlers/likes/put';

export const likesAccessibleRouter = createOpenApiHono<{ Bindings: Env }>();

likesAccessibleRouter.openapi(likePutRoute, likePutHandler);

// public
import likeGetRoute from '@/routes/likes/get';
import likeGetHandler from '@/handlers/likes/get';

export const likesPublicRouter = createOpenApiHono<{ Bindings: Env }>();

likesPublicRouter.openapi(likeGetRoute, likeGetHandler);
