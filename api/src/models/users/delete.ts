import { createRoute, z } from '@hono/zod-openapi';
import { UserPasswordSchema } from '@/schemas/users';
import { AuthorizationSchema } from '@/schemas/common';

const route = createRoute({
	path: '/',
	method: 'delete',
	description: 'ユーザを削除する',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: UserPasswordSchema,
				},
			},
		},
		headers: AuthorizationSchema,
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
							example: { message: 'User deleted' },
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
							example: { error: 'Authorization failed' },
						}),
				},
			},
		},
	},
});

export default route;
