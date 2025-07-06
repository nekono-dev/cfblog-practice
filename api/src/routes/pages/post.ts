import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  path: '/pages',
  method: 'post',
  description: 'ページに情報を書き込む',
  security: [{ Bearer: [] }],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object({
            pageId: z.string(),
            title: z.string(),
            text: z.string().nullable(),
            imgId: z.string().nullable().optional(),
            tags: z.string().array(),
            date: z.coerce.date(),
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
              example: { message: 'Page created' },
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
    500: {
      description: 'NG',
      content: {
        'application/json': {
          schema: z
            .object({
              error: z.string(),
            })
            .openapi({
              example: { error: 'Internal Server Error' },
            }),
        },
      },
    },
    405: {
      description: 'NG',
      content: {
        'application/json': {
          schema: z
            .object({
              error: z.string(),
            })
            .openapi({
              example: { error: 'Method Not Allowed' },
            }),
        },
      },
    },
  },
});

export default route;
