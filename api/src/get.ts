import { PrismaClient } from './generated/prisma/';

const get = async ({
	request,
	prisma,
	contentName,
}: {
	request: Request;
	prisma: PrismaClient;
	contentName: string;
}) => {
	// GETではない場合はdefalutへ
	if (request.method !== 'GET') {
		const post = await prisma.page.findUnique({
			where: {
				pageId: contentName,
			},
		});
		return;
	}
	// 📝上記はまだ未実施
};

export default get;
