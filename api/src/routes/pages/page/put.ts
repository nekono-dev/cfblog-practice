import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  path: '/pages/page/{pageId}',
  method: 'put',
  description: 'Update an existing page with new content and metadata.',
  tags: ['pages'],
  security: [{ Bearer: [] }],
  request: {
    params: z.object({
      pageId: z.string().min(1),
    }),
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object({
            pageId: z.string().nonempty().optional(),
            title: z.string().optional(),
            text: z.string().optional(),
            imgId: z.string().nullable().optional(),
            tags: z.string().array().optional(),
            date: z.coerce.date().optional(),
            isPublic: z.boolean().optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Page updated successfully',
      content: {
        'application/json': {
          schema: z
            .object({
              message: z.string(),
            })
            .openapi({
              example: { message: 'Page updated' },
            }),
        },
      },
    },
    400: {
      description: 'Invalid request body',
      content: {
        'application/json': {
          schema: z
            .object({ error: z.string() })
            .openapi({ example: { error: 'Invalid request' } }),
        },
      },
    },
    404: {
      description: 'Page not found',
      content: {
        'application/json': {
          schema: z
            .object({ error: z.string() })
            .openapi({ example: { error: 'Page not found' } }),
        },
      },
    },
    405: {
      description: 'Method not allowed',
      content: {
        'application/json': {
          schema: z
            .object({ error: z.string() })
            .openapi({ example: { error: 'Method Not Allowed' } }),
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
