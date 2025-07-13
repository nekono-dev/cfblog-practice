import { config } from '@/lib/apiClientConfig';
import { useState } from 'react';
import { setItem } from '@/common/localstorage';
import { UsersApi } from '@/client';

const Component = () => {
    const [handle, setHandle] = useState('');
    const [passwd, setPasswd] = useState('');
    const [status, setStatus] = useState('');

    const api = new UsersApi(config);
    const handlePost = async () => {
        try {
            const result = await api.usersTokenPost({
                usersPostRequest: {
                    passwd,
                    handle,
                },
            });
            setItem('token', result.token);
            setStatus('ログインに成功しました');
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.log(e.message);
            }
            setStatus('ログインに失敗しました');
        }
    };

    return (
        <div style={{ padding: '1em 0' }}>
            <div>
                <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="handle"
                />
                <input
                    type="password"
                    value={passwd}
                    onChange={(e) => setPasswd(e.target.value)}
                    placeholder="password"
                />
                <button onClick={handlePost}>ログイン</button>
            </div>
            <span>ステータス: {status}</span>
        </div>
    );
};

export default Component;
