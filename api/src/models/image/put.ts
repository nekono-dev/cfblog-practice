import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
	path: '/',
	method: 'put',
	description: '画像をアップロードする',
	request: {
		body: {
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
		200: {
			description: 'OK',
			content: {
				'application/json': {
					schema: z.object({
						message: z.string(),
						key: z.string(),
					}),
				},
			},
		},
		415: {
			description: 'NG',
			content: {
				'application/json': {
					schema: z.object({
						error: z.string(),
					}),
				},
			},
		},
		400: {
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
