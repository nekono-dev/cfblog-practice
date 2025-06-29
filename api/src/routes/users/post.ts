import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  path: '/users',
  method: 'post',
  description: 'ユーザを登録する',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            passwd: z.string().min(8),
            handle: z.string().min(8),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'OK',
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
      description: 'NG',
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
      description: 'NG',
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
