// import { SELF, env } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { usersPrivURL, usersTokenURL, usersURL } from './urls';

describe('User Control test', () => {
  const testUserHandle = 'testuser';
  const testUserPasswd = 'testpasswd';
  const testUserName = 'Test-User';
  it('[Positive] Create User', async () => {
    const response = await fetch(usersURL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        handle: testUserHandle,
        passwd: testUserPasswd,
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      message: 'User created',
    });
  });

  let userToken: string;
  it('[Positive] Get User Token', async () => {
    const response = await fetch(usersTokenURL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        handle: testUserHandle,
        passwd: testUserPasswd,
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toHaveProperty('token');
    userToken = z.object({ token: z.string() }).parse(apiResult).token;
    console.log('[user|log] User Token: ' + userToken);
  });

  it('[Positive] Get User Profile', async () => {
    const response = await fetch(new URL(testUserHandle, usersPrivURL), {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
    });
    const apiResult = await response.json();
    // 初期設定ではnameはUserHandleと同一
    expect(apiResult).toMatchObject({
      handle: testUserHandle,
      name: testUserHandle,
    });
    console.log('[user|log] User Profile: ' + JSON.stringify(apiResult));
  });

  it('[Positive] Update User Profile', async () => {
    const response = await fetch(usersPrivURL, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
      body: JSON.stringify({
        birthday: '2000-01-01',
        name: testUserName,
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      message: 'User updated',
    });
  });

  it('[Positive] Get User Profile updated', async () => {
    const response = await fetch(new URL(testUserHandle, usersPrivURL), {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      handle: testUserHandle,
      name: testUserName,
      birthday: '2000-01-01T00:00:00.000Z',
    });
    console.log('[user|log] User Profile: ' + JSON.stringify(apiResult));
  });

  it('[Positive] Get Other User Profile', async () => {
    const otherUserHandle = 'admin';
    const otherUserName = 'Administrator';
    const response = await fetch(new URL(otherUserHandle, usersPrivURL), {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      handle: otherUserHandle,
      name: otherUserName,
    });
  });

  const testUserUpdateHandle = 'testuserUpdated';
  const testUserUpdatePasswd = 'testuserPwdUpdated';
  // handleの変更
  it('[Positive] Update User Handle and passwd', async () => {
    const response = await fetch(usersPrivURL, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
      body: JSON.stringify({
        handle: testUserUpdateHandle,
        passwd: testUserUpdatePasswd,
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      message: 'User updated',
    });
  });

  // Handleが変わった後トークンが無効になることを確認
  it('[Negative] Check cannot use old token', async () => {
    const response = await fetch(new URL(testUserUpdateHandle, usersPrivURL), {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      error: 'Invalid token',
    });
  });

  it('[Positive] Get User Token updated', async () => {
    const response = await fetch(usersTokenURL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        handle: testUserUpdateHandle,
        passwd: testUserUpdatePasswd,
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toHaveProperty('token');
    userToken = z.object({ token: z.string() }).parse(apiResult).token;
    console.log('[user|log] User Token updated: ' + userToken);
  });

  it('[Positive] Get User Profile updated', async () => {
    const response = await fetch(new URL(testUserUpdateHandle, usersPrivURL), {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      handle: testUserUpdateHandle,
      name: testUserName,
      birthday: '2000-01-01T00:00:00.000Z',
    });
    console.log(
      '[user|log] User Profile updated: ' + JSON.stringify(apiResult)
    );
  });

  it('[Positive] Delete User', async () => {
    const response = await fetch(usersPrivURL, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
      body: JSON.stringify({
        passwd: testUserUpdatePasswd,
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      message: 'User deleted',
    });
  });
});
