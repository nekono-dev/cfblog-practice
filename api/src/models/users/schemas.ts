import { z } from 'zod';
import { UserSchema } from '@/generated/zod/modelSchema';

const PasswdSchema = z.object({
	passwd: z.string().min(8),
});

export const UserReqSchema = UserSchema.omit({
	id: true,
	handle: true,
	hashedPassword: true,
}).merge(PasswdSchema);
