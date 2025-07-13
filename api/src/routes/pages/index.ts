import { Env } from '@/common/env';
import createOpenApiHono from '@/lib/hono';

// protected
import pagePostRoute from '@/routes/pages/post';
import pagePostHandler from '@/handlers/pages/post';
import pagePutRoute from '@/routes/pages/page/put';
import pagePutHandler from '@/handlers/pages/put';
import pageDeleteRoute from '@/routes/pages/delete';
import pageDeleteHandler from '@/handlers/pages/delete';
import pageListRoute from "@/routes/pages/list/get"
import pageListHandler from "@/handlers/pages/list/get"

export const pagesRestrictedRouter = createOpenApiHono<{ Bindings: Env }>();

pagesRestrictedRouter.openapi(pageListRoute, pageListHandler);
pagesRestrictedRouter.openapi(pagePutRoute, pagePutHandler);
pagesRestrictedRouter.openapi(pagePostRoute, pagePostHandler);
pagesRestrictedRouter.openapi(pageDeleteRoute, pageDeleteHandler);

// public
import pageGetRoute from '@/routes/pages/page/get';
import pageGetHandler from '@/handlers/pages/page/get';

export const pagesPublicRouter = createOpenApiHono<{ Bindings: Env }>();

pagesPublicRouter.openapi(pageGetRoute, pageGetHandler);
