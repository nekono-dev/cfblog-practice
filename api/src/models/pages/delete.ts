import { createRoute, z } from '@hono/zod-openapi';
import { PageIdOptionsSchema } from '@/schemas/pages';

const route = createRoute({
	path: '/',
	method: 'delete',
	description: 'ページに情報を書き込む',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: PageIdOptionsSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: 'OK',
			content: {
				'application/json': {
					schema: z
						.object({
							message: z.string(),
						})
						.openapi({
							example: { message: 'Page deleted' },
						}),
				},
			},
		},
		404: {
			description: 'NG',
			content: {
				'application/json': {
					schema: z
						.object({
							error: z.string(),
						})
						.openapi({
							example: { error: 'Page not found' },
						}),
				},
			},
		},
		500: {
			description: 'NG',
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
	},
});

export default route;
