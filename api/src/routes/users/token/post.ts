import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  path: '/users/token',
  method: 'post',
  description: 'Generate an authentication token using user credentials.',
  tags: ["users"],
  request: {
    body: {
      required: true,
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
      description: 'Authentication token issued',
      content: {
        'application/json': {
          schema: z
            .object({
              token: z.string(),
            })
            .openapi({
              example: {
                token: 'XXXXXXXXXXXXX.XXXXXXXXXXX.XXXXXXX',
              },
            }),
        },
      },
    },
    400: {
      description: 'Missing or invalid input',
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
    401: {
      description: 'Incorrect credentials',
      content: {
        'application/json': {
          schema: z
            .object({
              error: z.string(),
            })
            .openapi({
              example: { error: 'Invalid credentials' },
            }),
        },
      },
    },
    403: {
      description: 'Login not permitted',
      content: {
        'application/json': {
          schema: z
            .object({
              error: z.string(),
            })
            .openapi({
              example: { error: 'Login not permitted' },
            }),
        },
      },
    },
  },
});
export default route;
