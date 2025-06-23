import { createRoute, z } from '@hono/zod-openapi';
import { AuthorizationSchema } from '@/common/schemas';

const route = createRoute({
  path: '/',
  method: 'get',
  description: 'ユーザプロフィールを表示',
  request: {
    headers: AuthorizationSchema,
    params: z.object({
      handle: z.string().min(8),
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
    503: {
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
