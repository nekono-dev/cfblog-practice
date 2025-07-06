import { Env } from '@/common/env';
import createOpenApiHono from '@/lib/hono';

// protected
import pagePostRoute from '@/routes/pages/post';
import pagePostHandler from '@/handlers/pages/post';
import pageDeleteRoute from '@/routes/pages/delete';
import pageDeleteHandler from '@/handlers/pages/delete';

export const pagesRestrictedRouter = createOpenApiHono<{ Bindings: Env }>();

pagesRestrictedRouter.openapi(pagePostRoute, pagePostHandler);
pagesRestrictedRouter.openapi(pageDeleteRoute, pageDeleteHandler);

// public
import pageGetRoute from '@/routes/pages/get';
import pageGetHandler from '@/handlers/pages/get';

export const pagesPublicRouter = createOpenApiHono<{ Bindings: Env }>();

pagesPublicRouter.openapi(pageGetRoute, pageGetHandler);
