import { createRoute, z } from '@hono/zod-openapi';
import { ImageKeySchema } from './schemas';

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
