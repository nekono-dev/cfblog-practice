import { z } from 'zod';

export const ImageKeyParamSchema = z.object({
	key: z.string().min(1),
});