import { Env } from '@/common/env';
import createOpenApiHono from '@/lib/hono';

// protected

// public
import tagGetRoute from '@/routes/tags/get';
import tagGetHandler from '@/handlers/tags/get';

export const tagsPublicRouter = createOpenApiHono<{ Bindings: Env }>();

tagsPublicRouter.openapi(tagGetRoute, tagGetHandler);
