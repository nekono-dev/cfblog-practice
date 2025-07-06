import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  path: '/users',
  method: 'put',
  description: 'Update user profile information. Only specified fields will be changed.',
  tags: ["users"],
  security: [{ Bearer: [] }],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object({
            passwd: z.string().min(8).optional(),
            handle: z.string().min(5).optional(),
            name: z.string().optional(),
            birthday: z.coerce.date().optional(),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User profile updated successfully',
      content: {
        'application/json': {
          schema: z
            .object({
              message: z.string(),
            })
            .openapi({
              example: { message: 'User updated' },
            }),
        },
      },
    },
    404: {
      description: 'User not found or invalid credentials',
      content: {
        'application/json': {
          schema: z
            .object({
              error: z.string(),
            })
            .openapi({
              example: { error: 'Invalid request' },
            }),
        },
      },
    },
    409: {
      description: 'Handle already in use',
      content: {
        'application/json': {
          schema: z
            .object({
              error: z.string(),
            })
            .openapi({
              example: { error: 'New handle already in use' },
            }),
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: z
            .object({
              error: z.string(),
            })
            .openapi({
              example: { error: 'Internal server error' },
            }),
        },
      },
    },
  },
});

export default route;
