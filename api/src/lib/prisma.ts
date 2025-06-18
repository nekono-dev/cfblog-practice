import { PrismaClient } from '../generated/prisma';
import { PrismaD1 } from '@prisma/adapter-d1';
import { Env } from '../env';

export const createPrismaClient = (env: Env) => {
	const adapter = new PrismaD1(env.DB);
	return new PrismaClient({ adapter });
};
