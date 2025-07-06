import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  path: '/users/{handle}',
  method: 'get',
  description: 'ユーザプロフィールを表示',
  security: [{ Bearer: [] }],
  request: {
    required: true,
    params: z.object({
      handle: z.string().min(1),
    }),
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({
            handle: z.string(),
            name: z.string(),
            birthday: z.coerce.date().nullable().optional(),
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
              example: { error: 'User not found' },
            }),
        },
      },
    },
  },
});
export default route;
