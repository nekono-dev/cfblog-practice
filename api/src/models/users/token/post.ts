import { createRoute, z } from '@hono/zod-openapi';
import { UserReqSchema } from '../schemas';

const route = createRoute({
	path: '/',
	method: 'post',
	description: 'ユーザトークンを作成する',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: UserReqSchema,
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
						token: z.string(),
					}),
				},
			},
		},
		401: {
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
