import { z } from 'zod';

export const AuthorizationSchema = z.object({
  authorization: z.string().openapi({
    description: 'User token',
    example: 'Bearer <Token>',
  }),
});
