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

import { PrismaClient } from './generated/prisma/';
import { PrismaD1 } from '@prisma/adapter-d1';
import upload from './upload';
import get from './get';

export interface Env {
	BUCKET: R2Bucket;
	DB: D1Database;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		// 認証の検討後、本workerは分離することを考慮する

		// "",upload, XXXX といった、先頭文字0を回避
		const urlSplitted = url.pathname.split('/').splice(0, 1);
		if (urlSplitted.length !== 0) {
			const methodName = urlSplitted[0];
			let response;

			const adapter = new PrismaD1(env.DB);
			const prisma = new PrismaClient({ adapter });

			switch (methodName) {
				case 'upload':
					// /upload/XXXX の形式ではない場合
					// splitの結果が"upload","XXXX" ではない場合は拒否
					if (urlSplitted.length !== 2) {
						break;
					}
					// uploadプロセスより結果を取得
					response = await upload({
						request: request,
						bucket: env.BUCKET,
						prisma: prisma,
						contentName: urlSplitted[1],
					});
					break;
				default:
					// splitの結果でサブパスが存在する場合は拒否
					if (urlSplitted.length !== 1) {
						break;
					}
					response = await get({
						request: request,
						prisma: prisma,
						contentName: urlSplitted[1],
					});
					break;
			}
			if (response !== undefined) {
				return response;
			}
		}
		// メソッド誤りとして返却
		return new Response(
			JSON.stringify({
				error: 'Method Not Allowd',
			}),
			{ status: 405 }
		);
	},
};
