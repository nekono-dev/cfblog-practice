import { z } from 'zod';
import { PageSchema } from '@/generated/zod/modelSchema';

export const PageIdSchema = z.object({
	pageId: z.string().min(1),
});

export const PageIdOptionsSchema = PageIdSchema.extend({
	option: z.object({
		deleteImage: z.boolean().optional()
	})
});


export const PageResSchema = PageSchema.extend({
	tags: z.string().array(),
});

export const PageReqSchema = PageSchema.omit({
	id: true,
})
	.partial({
		imgId: true,
	})
	.extend({
		date: z.coerce.date(), // ISO 文字列を Date に
		tags: z.array(z.string()), // 追加: タグのラベル or ID の配列
	});
