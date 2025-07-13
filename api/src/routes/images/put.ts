import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  path: '/images',
  method: 'put',
  description: 'Upload a PNG or JPEG image to the server.',
  security: [{ Bearer: [] }],
  request: {
    body: {
      required: true,
      content: {
        'image/png': {
          schema: z.any().openapi({
            type: 'string',
            format: 'binary',
          }),
        },
        'image/jpeg': {
          schema: z.any().openapi({
            type: 'string',
            format: 'binary',
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Image uploaded successfully',
      content: {
        'application/json': {
          schema: z
            .object({
              message: z.string(),
              key: z.string(),
            })
            .openapi({
              example: {
                message: 'Image uploaded',
                key: 'XXXXXXX-YYYYYY.png',
              },
            }),
        },
      },
    },
    400: {
      description: 'Uploaded image is empty or invalid',
      content: {
        'application/json': {
          schema: z
            .object({
              error: z.string(),
            })
            .openapi({
              example: { error: 'Uploaded image is empty' },
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
    415: {
      description: 'Unsupported media type',
      content: {
        'application/json': {
          schema: z
            .object({
              error: z.string(),
            })
            .openapi({
              example: { error: 'Unsupported Content-Type' },
            }),
        },
      },
    },
  },
});

export default route;
