import { createRoute, z } from '@hono/zod-openapi';
import { ImageKeySchema } from '@/schemas/images';

const route = createRoute({
	path: '/{key}',
	method: 'get',
	description: 'デバッグ用: 画像を取得する',
	request: {
		params: ImageKeySchema,
	},
	responses: {
		200: {
			description: 'OK',
			content: {
				'image/png': {
					schema: z.any().openapi({
						format: 'binary',
						example: '<png binary stream>',
					}),
				},
				'image/jpeg': {
					schema: z.any().openapi({
						format: 'binary',
						example: '<jpeg binary stream>',
					}),
				},
			},
		},
		404: {
			description: 'NG',
			content: {
				'application/json': {
					schema: z.object({
						error: z.string(),
					}),
				},
			},
		},
	},
});

export default route;
