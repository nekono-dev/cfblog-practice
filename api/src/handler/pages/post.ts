import { OpenAPIHono } from '@hono/zod-openapi';
import { Env } from '@/env';
import { createPrismaClient } from '@/lib/prisma';
import route from '@/models/pages/post';

const app = new OpenAPIHono<{ Bindings: Env }>({ strict: true });

app.openapi(route, async (c) => {
	const prisma = createPrismaClient(c.env);

	const { pageId, title, text, imgId, date, tags } = c.req.valid('json');

	try {
		// 1. 既存タグを一括取得
		const existingTags = await prisma.tag.findMany({
			where: { label: { in: tags } },
			select: { id: true, label: true },
		});

		const existingLabels = new Set(existingTags.map((t) => t.label));
		const newLabels = tags.filter((label) => !existingLabels.has(label));

		// 2. 新規タグを一括作成（必要があれば）
		const createTags = newLabels.map((label) => ({ label }));

		// 3. トランザクションでまとめて処理
		const [createdTags, page] = await prisma.$transaction([
			prisma.tag.createMany({ data: createTags }),
			prisma.page.create({
				data: {
					pageId,
					title,
					text,
					imgId,
					date,
				},
			}),
		]);

		// 4. 全タグIDを取得（既存 + 新規）
		const allTags = await prisma.tag.findMany({
			where: { label: { in: tags } },
			select: { id: true },
		});

		// 5. 中間テーブルを一括作成
		await prisma.pageTags.createMany({
			data: allTags.map((tag) => ({
				pageId: page.id,
				tagId: tag.id,
			})),
		});

		return c.json({ message: 'Page created' }, 201);
	} catch (e: any) {
		console.log(e);
		return c.json({ error: 'Internal Server Error' }, 500);
	} finally {
		await prisma.$disconnect();
	}
});

export default app;
