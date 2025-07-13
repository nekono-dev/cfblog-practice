import { config } from '@/common/clientconfig';
import { useState } from 'react';
import { setItem } from '@/common/localstorage';
import { UsersApi } from '@/client';

const Component = () => {
  const [handle, setHandle] = useState('');
  const [passwd, setPasswd] = useState('');

  const api = new UsersApi(config);
  const handlePost = async () => {
    try {
      await api.usersPost({
        usersPostRequest: {
          passwd,
          handle,
        },
      });
      const result = await api.usersTokenPost({
        usersPostRequest: {
          passwd,
          handle,
        },
      });
      setItem('token', result.token);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.log(e.message);
      }
    }
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
      <button onClick={handlePost}>ユーザ作成</button>
    </div>
  );
};

export default Component;
