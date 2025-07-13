import { Env } from '@/common/env';
import createOpenApiHono from '@/lib/hono';

// protected
import adminUsersHandleTokenRoute from '@/routes/admin/users/{handle}/token/post';
import adminUsersHandleTokenHandler from '@/handlers/admin/users/{handle}/token/post';

export const adminRestrictedRouter = createOpenApiHono<{ Bindings: Env }>();

adminRestrictedRouter.openapi(
  adminUsersHandleTokenRoute,
  adminUsersHandleTokenHandler
);
