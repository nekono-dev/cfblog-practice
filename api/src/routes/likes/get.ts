import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  method: 'get',
  path: '/likes/{pageId}',
  description: 'Get total like count for the specified page.',
  tags: ["likes"],
  request: {
    required: true,
    params: z.object({
      pageId: z.string().min(1),
    }),
  },
  responses: {
    200: {
      description: 'Like count retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            count: z.number().openapi({ example: 42 }),
          }),
        },
      },
    },
    404: {
      description: 'Page not found',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().openapi({ example: 'Page not found' }),
          }),
        },
      },
    },
    400: {
      description: 'Invalid request',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().openapi({ example: 'Invalid request' }),
          }),
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().openapi({ example: 'Internal Server Error' }),
          }),
        },
      },
    },
  },
});

export default route;
