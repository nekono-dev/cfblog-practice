import { createRoute, z } from '@hono/zod-openapi';
import { ImageKeySchema } from '@/schemas/images';

const route = createRoute({
	path: '/',
	method: 'delete',
	description: '画像を削除する',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: ImageKeySchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: 'OK',
			content: {
				'application/json': {
					schema: z.object({
						message: z.string(),
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
		500: {
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
