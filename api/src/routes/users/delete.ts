import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  path: '/users',
  method: 'delete',
  description: 'Delete an existing user account after verifying credentials.',
  tags: ["users"],
  security: [{ Bearer: [] }],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object({
            passwd: z.string().min(8),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User account deleted successfully',
      content: {
        'application/json': {
          schema: z
            .object({
              message: z.string(),
            })
            .openapi({
              example: { message: 'User deleted' },
            }),
        },
      },
    },
    401: {
      description: 'Authorization failed',
      content: {
        'application/json': {
          schema: z
            .object({
              error: z.string(),
            })
            .openapi({
              example: { error: 'Authorization failed' },
            }),
        },
      },
    },
  },
});

export default route;
