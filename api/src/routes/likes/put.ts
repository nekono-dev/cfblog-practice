import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  method: 'put',
  path: '/likes',
  description: 'Likeを追加する',
  security: [{ Bearer: [] }],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object({
            pageId: z.string(),
            count: z.number().min(0),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Like registered successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Like registered' }),
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
    404: {
      description: 'Resource not found',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().openapi({ example: 'User or Page not found' }),
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
