import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  path: '/users',
  method: 'put',
  description: 'ユーザ情報を更新する',
  security: [{ Bearer: [] }],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object({
            passwd: z.string().min(8).optional(),
            handle: z.string().min(8).optional(),
            name: z.string().optional(),
            birthday: z.coerce.date(),
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
              example: { message: 'User updated' },
            }),
        },
      },
    },
    404: {
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
    409: {
      description: 'NG',
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
      description: 'NG',
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
