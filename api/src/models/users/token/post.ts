import { createRoute, z } from '@hono/zod-openapi';
import { UserPasswordReqSchema } from '@/schemas/users';

const route = createRoute({
	path: '/',
	method: 'post',
	description: 'ユーザトークンを作成する',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: UserPasswordReqSchema,
				},
			},
		},
	},
	responses: {
		201: {
			description: 'OK',
			content: {
				'application/json': {
					schema: z
						.object({
							token: z.string(),
						})
						.openapi({
							example: { token: 'XXXXXXXXXXXXX.XXXXXXXXXXX.XXXXXXX' },
						}),
				},
			},
		},
		401: {
			description: 'NG',
			content: {
				'application/json': {
					schema: z
						.object({
							error: z.string(),
						})
						.openapi({
							example: { error: 'Invalid credentials' },
						}),
				},
			},
		},
	},
});

export default route;
