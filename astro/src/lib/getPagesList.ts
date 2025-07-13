import { PagesApi } from '@/client';
import { config } from '@/lib/apiClientConfig';
const token: string = import.meta.env.CI_TOKEN;

const getPageList = async () => {
  const pagesApi = new PagesApi(config);
  const getPageResult = await pagesApi.pagesListGet({
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
  });
  return getPageResult.pages;
};
export default getPageList;
