import { Env } from '@/common/env';
import createOpenApiHono from '@/lib/hono';

// protected
import likePutRoute from '@/routes/likes/put';
import likePutHandler from '@/handlers/likes/put';

export const likesAccessibleRouter = createOpenApiHono<{ Bindings: Env }>();

likesAccessibleRouter.openapi(likePutRoute, likePutHandler);

// public

// export const pagesPublicRouter = createOpenApiHono<{ Bindings: Env }>();

// pagesPublicRouter.openapi(, );
