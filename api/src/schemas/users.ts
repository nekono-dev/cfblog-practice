import { z } from 'zod';
import { UserSchema } from '@/generated/zod/modelSchema';

export const UserPasswordSchema = z.object({
	passwd: z.string().min(8),
});

export const UserHandleSchema = z.object({
	handle: z.string().min(8),
});

export const UserPasswordReqSchema = UserHandleSchema.merge(UserPasswordSchema);

export const UserProfileResSchema = UserSchema.omit({
	id: true,
	hashedPassword: true,
}).partial({
	birthday: true,
});
