import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  path: '/users',
  method: 'put',
  description: 'ユーザ情報を更新する',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object({
            passwd: z.string().min(8).optional(),
            handle: z.string().min(8),
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
  },
});

export default route;
