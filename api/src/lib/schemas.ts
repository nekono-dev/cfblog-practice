import { z } from 'zod';
import { PageSchema, UserSchema } from '../generated/zod/modelSchema';

export const PageInputSchema = PageSchema.omit({ id: true }).partial({
	imgId: true,
});

const PasswdSchema = z.object({
	passwd: z.string().min(8),
});

export const UserLoginInputSchema = UserSchema.omit({
	id: true,
	name: true,
	hashedPassword: true,
}).merge(PasswdSchema);
