import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  path: '/pages/list',
  method: 'get',
  description: 'Retrieve a list of public pages',
  tags: ['pages'],
  responses: {
    200: {
      description: 'List of pages retrieved successfully',
      content: {
        'application/json': {
          schema: z
            .object({
              pages: z
                .object({
                  pageId: z.string(),
                  title: z.string(),
                  text: z.string().nullable(),
                  imgId: z.string().nullable(),
                  date: z.coerce.date(),
                  tags: z.array(z.string()),
                })
                .array(),
            })
            .openapi({
              example: {
                pages: [
                  {
                    pageId: 'page-id-123',
                    title: 'Sample Page',
                    text: 'This is a summary of the sample page.',
                    imgId: 'XXXXXX-YYYYY.jpg',
                    date: new Date('2025-01-02T00:00:00Z'),
                    tags: ['tag1', 'tag2'],
                  },
                ],
              },
            }),
        },
      },
    },
    400: {
      description: 'Invalid request',
      content: {
        'application/json': {
          schema: z
            .object({ error: z.string() })
            .openapi({ example: { error: 'Invalid request parameters' } }),
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: z
            .object({ error: z.string() })
            .openapi({ example: { error: 'Internal Server Error' } }),
        },
      },
    },
  },
});

export default route;
