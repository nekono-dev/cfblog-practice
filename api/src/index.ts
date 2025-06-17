/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// export default {
// 	async fetch(request, env, ctx): Promise<Response> {
// 		return new Response('Hello World!');
// 	},
// } satisfies ExportedHandler<Env>;

import { Prisma, PrismaClient } from './generated/prisma/';
import { PrismaD1 } from '@prisma/adapter-d1';
import { PageSchema } from './generated/zod/modelSchema';

const PageInputSchema = PageSchema.omit({ id: true }).partial({ imgId: true });

export interface Env {
	BUCKET: R2Bucket;
	DB: D1Database;
}

import { Hono } from 'hono';

const app = new Hono<{ Bindings: Env }>({ strict: true });

/**
 * 画像アップロード
 */
app.post('/upload/image', async (c) => {
	const contentType = c.req.header('Content-Type');
	if (contentType === undefined) {
		return c.json({ error: 'Method Not Allowed' }, 405);
	}
	if (!contentType.startsWith('image/')) {
		return c.json({ error: 'Unsupported Content-Type' }, 415);
	}
	const body = await c.req.arrayBuffer();
	const size = body.byteLength;

	if (size === 0) {
		return c.json({ error: 'Uploaded image is empty' }, 400);
	}
	const extension = contentType.split('/')[1];

	// ファイル名.jpeg, ファイル名.png
	const filename = `${crypto.randomUUID().replace(/-/g, '')}.${extension}`;
	await c.env.BUCKET.put(filename, body, {
		httpMetadata: {
			contentType,
		},
	});
	return new Response(JSON.stringify({ key: filename }));
});

/**
 * ブログアップロード
 */
app.post('/upload/post', async (c) => {
	const contentType = c.req.header('Content-Type');
	if (contentType === undefined) {
		return c.json({ error: 'Method Not Allowed' }, 405);
	}
	if (!contentType.startsWith('application/json')) {
		return c.json({ error: 'Unsupported Content-Type' }, 415);
	}
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });

	// 型の検証
	let json: unknown;
	try {
		json = await c.req.json();
	} catch {
		return c.json({ error: 'Invalid JSON format' }, 400);
	}
	const parsedJson = PageInputSchema.safeParse(json);

	if (!parsedJson.success) {
		return c.json({ error: 'Invalid request' }, 400);
	}
	try {
		const body: Prisma.PageCreateInput = parsedJson.data;
		const result = await prisma.page.create({
			data: body,
		});
		return c.json(result, 200);
	} catch (err: unknown) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			if (err.code === 'P2002') {
				return c.json({ error: 'Contents already exists' }, 409);
			}
		}
		return c.json({ error: 'Internal Server Error' }, 500);
	}
});

/**
 * データベース参照
 */
app.get('/:pageId', async (c) => {
	const pageId = c.req.param('pageId');
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });
	try {
		const page = await prisma.page.findUnique({
			where: { pageId: pageId },
		});

		if (!page) {
			return c.json({ error: 'Page not found' }, 404);
		}
		return c.json(page);
	} catch (err) {
		console.error(err);
		return c.json({ error: 'Internal Server Error' }, 500);
	}
});
/**
 * ローカルでアップロード状態を確認するためのエンドポイント
 */
// app.get('/image/:key{.+}', async (c) => {
// 	const key = c.req.param('key');
// 	const object = await c.env.BUCKET.get(key);
// 	if (!object) return c.notFound();
// 	return new Response(object.body, {
// 		headers: {
// 			'Content-Type':
// 				object.httpMetadata?.contentType || 'application/octet-stream',
// 		},
// 	});
// });

export default app;
