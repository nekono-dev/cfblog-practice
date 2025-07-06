import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  path: '/users',
  method: 'post',
  description: 'Register a new user with a handle and password.',
  tags: ["users"],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            passwd: z.string().min(8),
            handle: z.string().min(5),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User created successfully',
      content: {
        'application/json': {
          schema: z
            .object({
              message: z.string(),
            })
            .openapi({
              example: { message: 'User created' },
            }),
        },
      },
    },
    400: {
      description: 'Invalid input',
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
    403: {
      description: 'Handle already in use',
      content: {
        'application/json': {
          schema: z
            .object({
              error: z.string(),
            })
            .openapi({
              example: { error: 'Handle already in use' },
            }),
        },
      },
    },
  },
});

export default route;
