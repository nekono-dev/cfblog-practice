import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  path: '/pages',
  method: 'delete',
  description:
    'Delete one or more pages, optionally removing associated images.',
  tags: ['pages'],
  security: [{ Bearer: [] }],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object({
            pageId: z.string().min(1).array(),
            option: z
              .object({
                deleteImage: z.boolean().optional(),
              })
              .optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Page(s) deleted successfully',
      content: {
        'application/json': {
          schema: z
            .object({
              message: z.string(),
            })
            .openapi({
              example: { message: 'Page deleted' },
            }),
        },
      },
    },
    404: {
      description: 'One or more pages not found',
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
