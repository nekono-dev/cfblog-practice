import { createRoute, z } from '@hono/zod-openapi';
import { AuthorizationSchema } from '@/schemas/common';
import { UserHandleSchema, UserProfileResSchema } from '@/schemas/users';

const route = createRoute({
	path: '/',
	method: 'get',
	description: 'ユーザプロフィールを表示',
	request: {
		headers: AuthorizationSchema,
		params: UserHandleSchema,
	},
	responses: {
		200: {
			description: 'OK',
			content: {
				'application/json': {
					schema: UserProfileResSchema,
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
							example: { error: 'User not found' },
						}),
				},
			},
		},
		503: {
			description: 'NG',
			content: {
				'application/json': {
					schema: z
						.object({
							error: z.string(),
						})
						.openapi({
							example: { error: 'Invalid request' },
						}),
				},
			},
		},
	},
});

export default route;
