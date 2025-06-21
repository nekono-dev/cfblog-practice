import { z } from 'zod';
import { PageSchema } from '@/generated/zod/modelSchema';

export const PageIdParamSchema = z.object({
	pageId: z.string().min(1),
});

export const PageOutputSchema = PageSchema.extend({
	tags: z.string().array(),
});

export const PageInputSchema = PageSchema.omit({
	id: true,
})
	.partial({
		imgId: true,
	})
	.extend({
		date: z.coerce.date(), // ISO 文字列を Date に
		tags: z.array(z.string()), // 追加: タグのラベル or ID の配列
	});
