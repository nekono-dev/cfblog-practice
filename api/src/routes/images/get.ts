import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  path: '/images/{key}',
  method: 'get',
  description: 'Fetch an image by its key.',
  tags: ['images'],
  request: {
    required: true,
    params: z.object({ key: z.string() }),
  },
  responses: {
    200: {
      description: 'Image retrieved successfully',
      content: {
        'image/*': {
          schema: {
            type: 'string',
            format: 'binary',
            example: '<binary stream>',
          },
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
  },
});

export default route;
