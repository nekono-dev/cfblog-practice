import { z } from 'zod';

export const ImageKeySchema = z.object({
	key: z.string().min(1),
});
