import { Context } from 'hono';
import { ZodSchema } from 'zod';

/**
 * JSONの読み取り + Zodによるバリデーションを行う。
 * @param c Hono Context
 * @param schema zod スキーマ
 * @returns 成功時: パースされたデータ, 失敗時: null
 */
export async function parseJsonBody<T>(
	c: Context,
	schema: ZodSchema<T>
): Promise<{ data: T } | { error: Response }> {
	const contentType = c.req.header('Content-Type');
	if (!contentType?.startsWith('application/json')) {
		return { error: c.json({ error: 'Unsupported Content-Type' }, 415) };
	}

	let json: unknown;
	try {
		json = await c.req.json();
	} catch {
		return { error: c.json({ error: 'Invalid JSON format' }, 400) };
	}

	const parsed = schema.safeParse(json);
	if (!parsed.success) {
		return { error: c.json({ error: 'Invalid request' }, 400) };
	}

	return { data: parsed.data };
}
