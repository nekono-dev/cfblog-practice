import { createRoute, z } from '@hono/zod-openapi';
import { PageIdSchema, PageResSchema } from './schemas';

const route = createRoute({
	path: '/{pageId}',
	method: 'get',
	description: 'ページ情報を取得する',
	request: {
		params: PageIdSchema,
	},
	responses: {
		200: {
			description: 'OK',
			content: {
				'application/json': {
					schema: PageResSchema,
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
