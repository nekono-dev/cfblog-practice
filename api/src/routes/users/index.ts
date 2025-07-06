import { Env } from '@/common/env';
import createOpenApiHono from '@/lib/hono';

// protected
import userPutRoute from '@/routes/users/put';
import userPutHandler from '@/handlers/users/put';
import userDeleteRoute from '@/routes/users/delete';
import userDeleteHandler from '@/handlers/users/delete';
import userGetRoute from '@/routes/users/get';
import userGetHandler from '@/handlers/users/get';

export const usersRestrictedRouter = createOpenApiHono<{ Bindings: Env }>();

usersRestrictedRouter.openapi(userPutRoute, userPutHandler);
usersRestrictedRouter.openapi(userDeleteRoute, userDeleteHandler);
usersRestrictedRouter.openapi(userGetRoute, userGetHandler);

// public
import userPostRoute from '@/routes/users/post';
import userPostHandler from '@/handlers/users/post';
import userTokenRoute from '@/routes/users/token/post';
import userTokenHandler from '@/handlers/users/token/post';

export const usersPublicRouter = createOpenApiHono<{ Bindings: Env }>();

usersPublicRouter.openapi(userPostRoute, userPostHandler);
usersPublicRouter.openapi(userTokenRoute, userTokenHandler);
