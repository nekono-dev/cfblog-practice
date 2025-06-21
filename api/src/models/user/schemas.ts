import { z } from 'zod';
import { UserSchema } from '@/generated/zod/modelSchema';

const PasswdSchema = z.object({
	passwd: z.string().min(8),
});

export const UserLoginInputSchema = UserSchema.omit({
	id: true,
	name: true,
	hashedPassword: true,
}).merge(PasswdSchema);
