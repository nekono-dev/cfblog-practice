import { createRoute, z } from '@hono/zod-openapi';
import { PageIdParamSchema, PageOutputSchema } from './schemas';

const route = createRoute({
	path: '/{pageId}',
	method: 'get',
	description: 'ページ情報を取得する',
	request: {
		params: PageIdParamSchema,
	},
	responses: {
		200: {
			description: 'OK',
			content: {
				'application/json': {
					schema: PageOutputSchema,
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
