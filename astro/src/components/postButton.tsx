import { config } from '@/common/clientconfig';
import { useState } from 'react';
import { getItem } from '@/common/localstorage';
import { PagesApi } from '@/client';

const Component = () => {
  const [pageId, setPageid] = useState('');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [tag, setTag] = useState('');

  const handlePost = async () => {
    try {
      const token = getItem('token');
      const today = new Date();
      const tags = tag.split(',');

      console.log(token);
      const api = new PagesApi(config);
      await api.pagesPost(
        {
          pagesPostRequest: {
            pageId,
            title,
            text,
            tags,
            date: today.toISOString(),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json',
          },
        },
      );
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.log(e.message);
      }
    }
  };

  return (
    <div>
      <input
        type="pageId"
        value={pageId}
        onChange={(e) => setPageid(e.target.value)}
        placeholder="pageId"
      />
      <input
        type="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトル"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="本文"
      />
      <input
        type="tag"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        placeholder="タグをカンマ区切りで入力"
      />
      <button onClick={handlePost}>ポスト</button>
    </div>
  );
};

export default Component;
