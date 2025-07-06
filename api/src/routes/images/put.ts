import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  path: '/images',
  method: 'put',
  description: '画像をアップロードする',
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
      description: 'OK',
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
    415: {
      description: 'NG',
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
    400: {
      description: 'NG',
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
  },
});

export default route;
