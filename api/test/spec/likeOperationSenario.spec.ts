// import { SELF, env } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  usersTokenURL,
  pagesPrivURL,
  likesPrivURL,
  usersURL,
  likesURL,
  usersPrivURL,
} from '../common/urls';
import { adminHandle, adminPasswd } from '../common/param';

describe('Like Operation test', () => {
  let adminToken: string;
  it('🟢[Positive] Get Admin token', async () => {
    const response = await fetch(usersTokenURL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        handle: adminHandle,
        passwd: adminPasswd,
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toHaveProperty('token');
    adminToken = z.object({ token: z.string() }).parse(apiResult).token;
  });

  const opeUserHandle = 'likeuser';
  const opeUserPasswd = 'likeuserpaswd';
  it('🟢[Positive] Create ope user', async () => {
    const response = await fetch(usersURL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        handle: opeUserHandle,
        passwd: opeUserPasswd,
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      message: 'User created',
    });
  });

  let userToken: string;
  it('🟢[Positive] Get User Token', async () => {
    const response = await fetch(usersTokenURL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        handle: opeUserHandle,
        passwd: opeUserPasswd,
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toHaveProperty('token');
    userToken = z.object({ token: z.string() }).parse(apiResult).token;
  });

  const testPageId = 'liketest';
  // タグ0, タグ1を含むページを作成
  it('🟢[Positive] Create page, include tag0, tag1 only', async () => {
    const response = await fetch(pagesPrivURL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + adminToken,
      },
      body: JSON.stringify({
        pageId: testPageId,
        title: 'TestPage',
        text: 'TestText',
        tags: ['test'],
        date: '2000-01-01',
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      message: 'Page created',
    });
  });

  it('🟢[Positive] Add like as anonymous user', async () => {
    const response = await fetch(likesPrivURL, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
      body: JSON.stringify({
        pageId: testPageId,
        count: 10,
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      message: 'Like registered',
    });
  });

  it('🟢[Positive] Add like as test user', async () => {
    const response = await fetch(likesPrivURL, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
      body: JSON.stringify({
        pageId: testPageId,
        count: 100,
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      message: 'Like registered',
    });
  });

  it('🟢[Positive] Get likes', async () => {
    const response = await fetch(new URL(testPageId, likesURL), {
      method: 'GET',
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      count: 110,
    });
  });

  it('🟢[Positive] Delete ope user', async () => {
    const response = await fetch(usersPrivURL, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
      body: JSON.stringify({
        passwd: opeUserPasswd,
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      message: 'User deleted',
    });
  });
  // ユーザ作成後もlikeのトータルが変わらないことを確認
  it('🟢[Positive] Not likes decreased', async () => {
    const response = await fetch(new URL(testPageId, likesURL), {
      method: 'GET',
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      count: 110,
    });
  });

  it('🟢[Positive] Delete Created page', async () => {
    const response = await fetch(pagesPrivURL, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + adminToken,
      },
      body: JSON.stringify({
        pageId: [testPageId],
        option: {
          deleteImage: true,
        },
      }),
    });
    const apiResult = await response.json();
    expect(apiResult).toMatchObject({
      message: 'Page deleted',
    });
  });
});
