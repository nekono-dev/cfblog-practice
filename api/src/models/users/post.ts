import { createRoute, z } from '@hono/zod-openapi';
import { UserReqSchema } from './schemas';

const route = createRoute({
	path: '/',
	method: 'post',
	description: 'ユーザを登録する',
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
						message: z.string(),
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
