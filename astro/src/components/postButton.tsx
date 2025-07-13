import { config } from '@/lib/apiClientConfig';
import { useState } from 'react';
import { getItem } from '@/common/localstorage';
import { PagesApi } from '@/client';
import { postrenderUrl, prirenderUrl } from '@/common/vars';
import type { JSX } from 'astro/jsx-runtime';

const Component = () => {
    const [pageId, setPageid] = useState('');
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [tag, setTag] = useState('');
    const [status, setStatus] = useState<JSX.Element>(<></>);

    const handlePost = async () => {
        try {
            const token = getItem('token');
            const today = new Date();
            const tags = tag.split(',');

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
            const prirenderPath = new URL(pageId, prirenderUrl);
            const postrenderPath = new URL(pageId, postrenderUrl);
            setStatus(
                <>
                    ページを登録
                    <div>
                        Prirenderd-Path（要Restart）: {prirenderPath.href}
                    </div>
                    <div>
                        PostRenderd-Path（アクセス可）: <a href={postrenderPath.href}>{postrenderPath.href}</a>
                    </div>
                </>,
            );
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.log(e.message);
            }
            setStatus(<>ページ登録に失敗しました</>);
        }
    };

    return (
        <div style={{ padding: '1em 0' }}>
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
            </div>
            <div>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="本文"
                />
            </div>
            <div>
                <input
                    type="tag"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="タグをカンマ区切りで入力"
                />
                <button onClick={handlePost}>ページを登録</button>
            </div>
            <div>ステータス: {status}</div>
        </div>
    );
};

export default Component;
