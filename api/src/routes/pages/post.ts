import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  path: '/pages',
  method: 'post',
  description: 'Create a new page with specified content and metadata.',
  tags: ['pages'],
  security: [{ Bearer: [] }],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object({
            pageId: z.string().nonempty(),
            title: z.string(),
            text: z.string(),
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
      description: 'Page created successfully',
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
      description: 'Invalid request body',
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
    405: {
      description: 'Method not allowed for this endpoint',
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
