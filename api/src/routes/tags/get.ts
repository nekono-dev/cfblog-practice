import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  method: 'get',
  path: '/tags/{label}',
  description: 'Get public page list for a given tag label',
  tags: ["tags"],
  request: {
    params: z.object({
      label: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'Public pages matching the tag retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            pages: z.array(
              z.object({
                pageId: z.string(),
                title: z.string(),
                text: z.string().nullable(),
                imgId: z.string().nullable(),
                date: z.string().openapi({ format: 'date-time' }),
                tags: z.array(z.string()),
              })
            ),
          }),
        },
      },
    },
    404: {
      description: 'No public pages found for the given tag',
      content: {
        'application/json': {
          schema: z.object({
            error: z
              .string()
              .openapi({ example: 'No public pages found for the tag' }),
          }),
        },
      },
    },
    500: {
      description: 'Internal server error while retrieving tag data',
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
