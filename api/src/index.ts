import { OpenAPIHono } from '@hono/zod-openapi';
import { Env } from '@/env';

import imagesApi from './models/images';
import usersApi from './models/users';
import pagessApi from './models/pages';

import { swaggerUI } from '@hono/swagger-ui';

const app = new OpenAPIHono<{ Bindings: Env }>({ strict: true });

app.route('/pages', pagessApi);
app.route('/images', imagesApi);
app.route('/users', usersApi);

// APIドキュメントを出力
app
	.doc('/openapi.json', {
		openapi: '3.0.0',
		info: {
			title: 'Cfblog-practice API',
			version: '1.0.0',
		},
	})
	.get('/docs', swaggerUI({ url: '/openapi.json' }));

export default app;
