import { config } from '@/lib/apiClientConfig';
import { useState } from 'react';
import { getItem } from '@/common/localStorage';
import { PagesApi, ImagesApi } from '@/client';
import { postrenderUrl, prirenderUrl } from '@/common/vars';
import type { JSX } from 'astro/jsx-runtime';

const Component = () => {
  const [pageId, setPageid] = useState('');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [tag, setTag] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState<JSX.Element>(<></>);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handlePost = async () => {
    try {
      const token = getItem('token');
      const today = new Date();
      const tags = tag.split(',');
      let imgId = '';

      // イメージが選択されている場合、アップロード実行
      if (imageFile) {
        // imageApi
        const imgApi = new ImagesApi(config);

        const response = await imgApi.imagesPut(
          {
            body: imageFile,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response?.key) {
          throw new Error('画像アップロードに失敗しました');
        }

        imgId = response.key;
      }

      // Page登録実行
      const api = new PagesApi(config);
      await api.pagesPost(
        {
          pagesPostRequest: {
            pageId,
            title,
            text,
            tags,
            date: today.toISOString(),
            imgId: imgId || undefined, // 画像なしならundefined
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json',
          },
        },
      );

      const prirenderPath = new URL(pageId, prirenderUrl);
      const postrenderPath = new URL(pageId, postrenderUrl);
      setStatus(
        <>
          ページを登録しました
          <div>Prirenderd-Path:{prirenderPath.href}</div>
          <div>
            PostRenderd-Path:
            <a href={postrenderPath.href}>{postrenderPath.href}</a>
          </div>
        </>,
      );
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
      }
      setStatus(<>ページ登録に失敗しました</>);
    }
  };

  return (
    <div style={{ padding: '1em 0' }}>
      <div>
        <label htmlFor="pageId">PageId</label>
        <input
          name="pageId"
          id="pageId"
          type="text"
          value={pageId}
          onChange={(e) => setPageid(e.target.value)}
          placeholder="pageId"
        />
      </div>
      <div>
        <label htmlFor="title">タイトル</label>
        <input
          name="title"
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトル"
        />
      </div>
      <div>
        <label htmlFor="text">タグ</label>
        <textarea
          name="text"
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="本文"
        />
      </div>
      <div>
        <label htmlFor="tags">タグ</label>
        <input
          type="text"
          name="tags"
          id="tags"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="タグをカンマ区切りで入力"
        />
      </div>
      <div>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImageFile(file);
              const preview = URL.createObjectURL(file);
              setPreviewUrl(preview);
            }
          }}
        />
      </div>
      <div>
        <button onClick={handlePost}>ページを登録</button>
      </div>
      <div>ステータス: {status}</div>
      <div>
        {previewUrl && (
          <div style={{ marginTop: '1em' }}>
            <p>プレビュー:</p>
            <img
              src={previewUrl}
              alt="プレビュー画像"
              style={{ maxWidth: '300px', borderRadius: '8px' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Component;
