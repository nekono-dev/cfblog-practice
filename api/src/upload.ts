import { PrismaClient } from './generated/prisma/';

const upload = async ({
	request,
	bucket,
	prisma,
	contentName,
}: {
	request: Request;
	bucket: R2Bucket;
	prisma: PrismaClient;
	contentName: string;
}) => {
	// POSTではない場合はdefalutへ
	if (request.method !== 'POST') {
		return;
	}
	switch (contentName) {
		case 'image':
			// 画像のアップロードの場合
			const key = crypto.randomUUID().replace(/-/g, '');
			await bucket.put(key, request.body);
			return new Response(JSON.stringify({ key: key }));
		case 'post':
			// DBへの記事登録の場合

            
			break;

		default:
			break;
	}
	return;
};

export default upload;
