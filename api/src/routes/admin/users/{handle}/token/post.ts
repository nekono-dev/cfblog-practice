import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  path: '/admin/users/{handle}/token',
  method: 'post',
  description: 'Admin-only: issue a token for the specified user',
  tags: ['admin', 'users'],
  request: {
    params: z.object({
      handle: z.string().min(1).openapi({ description: 'Target user handle' }),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            exp: z
              .number()
              .int()
              .positive()
              .optional()
              .openapi({
                description: 'Token expiration in seconds (optional)',
                example: 3600,
              }),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Token created successfully',
      content: {
        'application/json': {
          schema: z.object({
            token: z
              .string()
              .openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...' }),
          }),
        },
      },
    },
    403: {
      description: 'Permission denied (not admin)',
      content: {
        'application/json': {
          schema: z.object({ error: z.string() }),
        },
      },
    },
    404: {
      description: 'Target user not found',
      content: {
        'application/json': {
          schema: z.object({ error: z.string() }),
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: z.object({ error: z.string() }),
        },
      },
    },
  },
});

export default route;
