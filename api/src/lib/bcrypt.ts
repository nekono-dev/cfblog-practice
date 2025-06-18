import bcrypt from 'bcryptjs';

export const hashPassword = (pw: string) => bcrypt.hashSync(pw, 10);
export const comparePassword = (pw: string, hash: string) =>
	bcrypt.compareSync(pw, hash);
