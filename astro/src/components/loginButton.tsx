import { config } from '@/common/config';
import { UsersApi } from '@/client';
import { useState } from 'react';

const Component = () => {
  const [handle, setHandle] = useState('');
  const [passwd, setPasswd] = useState('');

  const [token, setToken] = useState<string>();
  const api = new UsersApi(config);

  const handlePost = async () => {
    const result = await api.usersTokenPost({
      usersPostRequest: {
        passwd,
        handle,
      },
    });
    setToken(result.token);
  };

  return (
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
      <button onClick={handlePost}>token</button>
      {token && <p>取得したトークン: {token}</p>}
    </div>
  );
};

export default Component;
