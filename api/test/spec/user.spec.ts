// import { SELF, env } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

describe('User Control test', () => {
  const testUserHandle = 'testuser';
  const testUserPasswd = 'testpasswd';
  const testUserName = 'Test-User';
  it('[Positive] Create User', async () => {
    const response = await fetch('http://localhost:8787/users', {
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
    const response = await fetch('http://localhost:8787/users/token', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        handle: 'testuser',
        passwd: 'testpasswd',
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toHaveProperty('token');
    userToken = z.object({ token: z.string() }).parse(apiResult).token;
    console.log('[user|log] User Token: ' + userToken);
  });

  it('[Positive] Update User Profile', async () => {
    const response = await fetch('http://localhost:8787/s/users', {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
      body: JSON.stringify({
        handle: testUserHandle,
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
    const response = await fetch(
      'http://localhost:8787/s/users/' + testUserHandle,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
      }
    );
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
    const response = await fetch(
      'http://localhost:8787/s/users/' + otherUserHandle,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
      }
    );
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      handle: otherUserHandle,
      name: otherUserName,
    });
  });

  it('[Positive] Delete User', async () => {
    const response = await fetch('http://localhost:8787/s/users', {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
      body: JSON.stringify({
        passwd: testUserPasswd,
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      message: 'User deleted',
    });
  });
});
