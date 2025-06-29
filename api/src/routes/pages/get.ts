import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  path: '/{pageId}',
  method: 'get',
  description: 'ページ情報を取得する',
  request: {
    required: true,
    params: z.object({
      pageId: z.string().min(1),
    }),
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z
            .object({
              pageId: z.string(),
              title: z.string(),
              text: z.string().nullable(),
              imgId: z.string().nullable(),
              tags: z.string().array(),
              date: z.coerce.date(),
            })
            .openapi({
              example: {
                pageId: 'page-id',
                date: new Date('2025-01-02 00:00:00'),
                title: 'sample-page',
                text: 'sample page content',
                imgId: 'XXXXXX-YYYYY.jpg',
                tags: ['tag1'],
              },
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
              example: { error: 'Page not found' },
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
  },
});

export default route;
