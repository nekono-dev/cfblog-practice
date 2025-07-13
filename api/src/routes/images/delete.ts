import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  path: '/images',
  method: 'delete',
  description: 'Delete an image using its key.',
  tags: ['images'],
  security: [{ Bearer: [] }],
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
      description: 'Image deleted successfully',
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
    400: {
      description: 'Invalid request format or missing key',
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
      description: 'Image not found',
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
