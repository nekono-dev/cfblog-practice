import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  path: '/',
  method: 'delete',
  description: '画像を削除する',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object({ key: z.string() }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z
            .object({
              message: z.string(),
            })
            .openapi({
              example: {
                message: 'Image deleted',
              },
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
              example: {
                error: 'Image not found',
              },
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
              example: {
                error: 'Internal Server Error',
              },
            }),
        },
      },
    },
  },
});

export default route;
