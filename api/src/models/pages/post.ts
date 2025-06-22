import { createRoute, z } from '@hono/zod-openapi';
import { PageReqSchema } from './schemas';

const route = createRoute({
	path: '/',
	method: 'post',
	description: 'ページに情報を書き込む',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: PageReqSchema,
				},
			},
		},
	},
	responses: {
		201: {
			description: 'OK',
			content: {
				'application/json': {
					schema: z.object({
						message: z.string(),
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
